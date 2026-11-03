

export const capitalize = (str: string)=> {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatText = (str: string) =>{
    return str.split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
    
    