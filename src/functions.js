import { arrayMoveMutable } from 'array-move';
// import { drexPath, mediaPath } from './config';

export function titleCase(str) {
    return str[0].toUpperCase() + str.slice(1);
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

export function gotoRail(railIdentifier) {
    return railIdentifier;
}

export 	function modifyDwellImageArray(map, image, action, imageIndex) {
    if (imageIndex != -1) {
        switch (action) {
            case 'remove':
            map.dwell.images.splice(imageIndex, 1);
                break;
            case 'moveup':
                arrayMoveMutable(map.dwell.images, imageIndex, imageIndex - 1);
                break;
            case 'movedown':
                arrayMoveMutable(map.dwell.images, imageIndex, imageIndex + 1);
                break;
        }
    }
    return map;
}

export function moveRailMapType(map, direction, type) {
    console.log(type);
    var increment = direction == 'up' ? -1 : 1;
    const typeIndex = map.content.findIndex((t) => t.title == type);
    console.log(typeIndex);
    arrayMoveMutable(map.content, typeIndex, typeIndex + increment);
    return map;
}

export function removeRailMapType(map, rail, type) {
    const confirmation = confirm('Remove "' + type.title + '" from rail ' + rail + '? This CANNOT be undone!');
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
    console.log(imageIndex);
    if (imageIndex != -1) {
        switch (action) {
            case 'remove':
                item.content.images.splice(imageIndex, 1);
                break;
            case 'moveup':
                arrayMoveMutable(item.content.images, imageIndex, imageIndex - 1);
                break;
            case 'movedown':
                arrayMoveMutable(item.content.images, imageIndex, imageIndex + 1);
                break;
        }
    }
    return item;
}