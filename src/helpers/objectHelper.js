export const isEmptyObject = (obj) => {
    let status = true

    console.log(obj.section_content)

    if (obj.section_content === '<p style="font-size: 12pt;"><br></p>') 
        status = true

    else {
        return false
    }
        
    for (let value of Object.values(obj)) {
        console.log(value)

        if (Array.isArray(value)) {
            if (value.length === 0) 
                status = true
            else
                status = false; break;
        }

        if (typeof value === "boolean") {
            status = true
        }

        if (value === null || value === "") 
            status = true
        else 
            status = false; break;
    }
  
    return status
}