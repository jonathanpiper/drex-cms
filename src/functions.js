import { arrayMoveMutable } from "array-move";
import { DREXPATH, MEDIAPATH } from "./config";

export function titleCase(str) {
    return str[0].toUpperCase() + str.slice(1);
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

export function gotoRail(railIdentifier) {
    return railIdentifier;
}

export function modifyDwellImageArray(map, image, action, imageIndex) {
    if (imageIndex != -1) {
        switch (action) {
            case "remove":
                map.dwell.images.splice(imageIndex, 1);
                break;
            case "moveup":
                arrayMoveMutable(map.dwell.images, imageIndex, imageIndex - 1);
                break;
            case "movedown":
                arrayMoveMutable(map.dwell.images, imageIndex, imageIndex + 1);
                break;
        }
    }
    return map;
}

export function moveRailMapType(map, direction, type) {
    console.log(type);
    var increment = direction == "up" ? -1 : 1;
    const typeIndex = map.content.findIndex((t) => t.title == type);
    console.log(typeIndex);
    arrayMoveMutable(map.content, typeIndex, typeIndex + increment);
    return map;
}

export function removeRailMapType(map, rail, type) {
    const confirmation = confirm(
        'Remove "' +
            type.title +
            '" from rail ' +
            rail +
            "? This CANNOT be undone!"
    );
    const typeIndex = map.content.findIndex((t) => t.title == type);
    if (confirmation) {
        map.content.splice(typeIndex, 1);
    }
    return map;
}

export function expandRail(map, newContent) {
    map.content = [...map.content, newContent];
    return map;
}

export function modifyImageArray(item, image, action) {
    const imageIndex = item.content.images.indexOf(image);
    if (imageIndex != -1) {
        switch (action) {
            case "remove":
                item.content.images.splice(imageIndex, 1);
                break;
            case "moveup":
                arrayMoveMutable(
                    item.content.images,
                    imageIndex,
                    imageIndex - 1
                );
                break;
            case "movedown":
                arrayMoveMutable(
                    item.content.images,
                    imageIndex,
                    imageIndex + 1
                );
                break;
        }
    }
    return item;
}

const loadImage = (path) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (e) => {
            reject(e);
        };
    });
};

export async function setObjectImageFile(imageArray = [], imageFile, imageIndex) {
    console.log(imageArray, imageFile);
    if (!imageArray[imageIndex]) {
        imageArray = [...imageArray, {}];
    }
    const image = await loadImage(MEDIAPATH + 'objects/' + imageFile)
    // let image = new Image();
    // image.src = MEDIAPATH + "objects/" + imageFile;
    console.log(image);
    // while (image.height == 0) {
    //     console.log('wtf')
    //     image.src = MEDIAPATH + 'objects/' + imageFile;
    // }
    console.log(image, image.height, image.width, 'image')
    imageArray[imageIndex].name = imageFile.slice(0, -4).split('_')[1];
    imageArray[imageIndex].width = image.width;
    imageArray[imageIndex].height = image.height;
    console.log(image.height, image.width)
    imageArray[imageIndex].altsizes = ['_half', '_quarter', '_threequarter'];
    console.log(imageArray);
    return imageArray;
}

export function setItemImageFile(imageArray = [], imageFile, imageIndex) {
    if (!imageArray[imageIndex]) {
        imageArray = [...imageArray, {}];
    }
    imageArray[imageIndex].full = imageFile;
    imageArray[imageIndex].thumbnail =
        imageFile.slice(0, -4) + "-THUMB" + imageFile.slice(-4);
    imageArray[imageIndex].caption = "";
    return imageArray;
}
