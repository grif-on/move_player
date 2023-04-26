/// <reference types="@mapeditor/tiled-api" />
/*
MIT License

Copyright (c) 2023 Grif_on

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//Intended for use in Tiled 1.8.6

function findObjectByType(mapLayerObject, type) {
	for (let i = mapLayerObject.layerCount - 1; i >= 0; i--) {
		const layer = mapLayerObject.layerAt(i)

		if (layer.isGroupLayer) {
			const obj = findObjectByType(layer, type)
			if (obj) {
				return obj;
			}
		} else if (layer.isObjectLayer) {
			for (const obj of layer.objects) {
				if (obj.type == type) {
					return obj;
				}
			}
		}
	}
	return null;
}

function findObjectByMultipleTypes(arraOfTypes) {
	let foundObject = null;
	arraOfTypes.forEach(type => {
		let tempFoundObject = findObjectByType(tiled.activeAsset, type);
		if (tempFoundObject !== null) foundObject = tempFoundObject;
	});
	return foundObject;
}

let sharedName = "Move player to the cursor";
let movePlayerToolStruct = {
	shouldBeEnabled: false,
	name: sharedName,
	icon: "pony.png",
	mousePressed(button, x, y, modifiers) {
		tiled.activeAsset.macro(sharedName, function () {
			let player = findObjectByMultipleTypes(["obj_Player","Player"]);
			if (player === null) {
				tiled.alert("Can't find Player object !")
			} else {
			player.x = x;
			player.y = y;
			}
		})
	},
	mapChanged(oldMap,newMap) {
		if (newMap === null) return; //in case there is no map (title screen)
		newMap.selectedLayersChanged.connect(function(asset) {
			/*movePlayerToolStruct.movePlayerToolStruct.enabled = false; // for some reason not working from here but work from updateEnabledState() (Tiled 1.8)*/
			movePlayerToolStruct.shouldBeEnabled = false;
			newMap.selectedLayers.forEach(layer => {
				if (layer) {
					movePlayerToolStruct.enabled = true;
					movePlayerToolStruct.shouldBeEnabled = true;
				}
				//tiled.log(layer.name);
			});
		})
	},
	updateEnabledState() {
			movePlayerToolStruct.enabled = movePlayerToolStruct.shouldBeEnabled;
	},
};

tiled.registerTool("MovePlayer", movePlayerToolStruct);
