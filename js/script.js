window.onload = function ()
{
    document.getElementById("compression-btn").addEventListener("click", () =>
    {
        compressImage();
    });
}

async function compressImage()
{
    let progressBarElement = document.getElementById("progressbar");

    progressBarElement.classList.remove("bg-success");
    progressBarElement.classList.add("progress-bar-animated");

    progressBarElement.style.width = "0%";

    let imageFile = document.getElementById("pick-file-input").files[0];
    let newWantedFileSize = document.getElementById("file-size-input").value;
    
    // check if correct max file size is given
    if (newWantedFileSize <= 0 || isNaN(newWantedFileSize))
    {
        console.log("Wrong file size. Skipping and setting default value...");
        newWantedFileSize = 1;    
    }

    let compressionOptions =
    {
        maxSizeMB: newWantedFileSize,
        alwaysKeepResolution: true,
        useWebWorker: true,
        onProgress: function (progress)
        {
            progressBarElement.style.width = progress + "%";

            // if progress percantage hits 100 then change progress bar styling. Later during new compression progress bar resets back to previous state
            if(progress == 100)
            {
                progressBarElement.classList.add("bg-success");
                progressBarElement.classList.remove("progress-bar-animated");
            }
        }
    }

    try
    {
        let compressedFile = await imageCompression(imageFile, compressionOptions);

        // create download url and simulate download click
        let link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFile);
        link.download = 'compressed_' + imageFile.name;
        link.click();
        console.log("Finished compressing image!");
    }
    catch (error)
    {
        document.getElementById("output-log").innerHTML = error;
        console.log(error);
    }
}