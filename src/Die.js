import React from "react"

function Die({value, held, handleClick})
{
    let diceLogoHtml
    
    if(value === 1)
    {
        diceLogoHtml = <i className="fa-solid fa-dice-one"></i>
    }
    else if(value === 2)
    {
        diceLogoHtml = <i className="fa-solid fa-dice-two"></i>
    }
    else if(value === 3)
    {
        diceLogoHtml = <i className="fa-solid fa-dice-three"></i>
    }
    else if(value === 4)
    {
        diceLogoHtml = <i className="fa-solid fa-dice-four"></i>
    }
    else if(value === 5)
    {
        diceLogoHtml = <i className="fa-solid fa-dice-five"></i>
    }
    else
    {
        diceLogoHtml = <i className="fa-solid fa-dice-six"></i>
    }
    
    return(
        <div 
            className="die" 
            style={{backgroundColor: held ? "#FFFF00" : "#FFFFFF"}} 
            onClick={handleClick}
        >
        {diceLogoHtml}
        </div>
    )
}

export default Die