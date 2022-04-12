import React from 'react';
import '../../css/FullsizeImageModal.css';
function ImageFullsizeModal({img, isFullsize, showMethod, imageName, closeFullSize, imageSource}) {

    const previewElement = document.getElementById("fullsizeImg");
    if(showMethod){
        var reader = new FileReader();
    
        reader.onload = function (x) {
            previewElement.src = x.target.result;
        }
        
        reader.readAsDataURL(img);
    }

    return (
        <div  className={!isFullsize ? "hide": 'fullsizeModal-container'}>
            <div className="fullsizeModal-opacityDiv"></div>
            <div className='fullsizeModal-innerDiv'>
                <img 
                    src={`http://localhost:3001/${imageSource}/${imageName}`} 
                    alt="" 
                    id="fullsizeImg"
                    onClick={closeFullSize}/>
            </div>
        </div>
    )
}

export default ImageFullsizeModal
