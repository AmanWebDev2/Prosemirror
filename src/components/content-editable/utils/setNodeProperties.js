export function setElementProperties(element,properties) {
    const props = properties ? Object.keys(properties) : [];
    if(element && props && Array.isArray(props) && props.length) {
        Object.assign(element.style, properties);
    }   
}