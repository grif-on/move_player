/// <reference types="@mapeditor/tiled-api" />
//For Tiled 1.8.6

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

let shouldBeEnabled = false;
let movePlayerToolStruct = {
	name: "Move player to the cursor",
	icon: "pony.png",
	mousePressed(button, x, y, modifiers) {
		tiled.activeAsset.macro("Move player", function () {
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
		newMap.selectedLayersChanged.connect(function(asset) {
			/*movePlayerToolStruct.enabled = false; // for some reason not working from here but work from updateEnabledState() (Tiled 1.8)*/
			shouldBeEnabled = false;
			newMap.selectedLayers.forEach(layer => {
				if (layer) {
					movePlayerToolStruct.enabled = true;
					shouldBeEnabled = true;
				}
				tiled.log(layer.name);
			});
		})
	},
	updateEnabledState() {
			movePlayerToolStruct.enabled = shouldBeEnabled;
	},
};

movePlayerToolStruct = tiled.registerTool("MovePlayer", movePlayerToolStruct);
