// FileManagerPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Filemanager.css"; // Import the CSS file
import lighthouse from "@lighthouse-web3/sdk";

const FileManagerPage = () => {
  const [files, setFiles] = useState([]);

  const [fileName, setFileName] = useState("");
  const [cid, setCid] = useState("");

  const walletAddress = localStorage.getItem("WalletAddress");
  console.log(walletAddress);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/retrieve?wallet=${walletAddress}`
        );
        const filesData = response.data.fileNameToCID; // Assuming response.data contains the filename:CID pairs
        console.log(filesData);
        // Update the file URLs with IPFS gateway URLs + CIDs
        const updatedFiles = Object.entries(filesData).map(([fileName, cid]) => ({
            name: fileName,
            url: `https://gateway.lighthouse.storage/ipfs/${cid}`,
          }));
          setFiles(updatedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (walletAddress) {
      fetchFiles();
    }
  }, [walletAddress]);

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (cid.length === 0) {
      alert("Please select a file or wait till it is uploaded");
    }
    console.log(cid, fileName);
    try {
      const postData = {
        walletAddress,
        contentID: cid,
        filename: fileName,
      };
      axios
        .post("http://localhost:5001/api/upload", postData) // change api url
        .then((response) => {
          console.log("Post request successful:", response.data);
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const specialUpload = async (fi) => {
    const output = await lighthouse.upload(
      fi,
      "4ebd3b81.03a927d43e4a492ebe8b0500947957f0",
      false,
      null,
      progressCallback
    );
    console.log("File Status:", output);
    console.log("filename", output.data.Name);
    setCid(output.data.Hash);
    setFileName(output.data.Name);
    if(output.data.Hash.length > 0){

    }
  };

  return (
    <div className="container">
      <h2>Your Files</h2>
      <h4>Store your files encrypted on the blockchain</h4>
      {files.length > 0 ? (
        <div className="file-list">
          {files.map((file, index) => (
            <div className="file-item" key={index}>
              <a
                className="file-link"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-files-message">
          No files are saved with this address.
        </p>
      )}
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          className="upload-input"
          type="file"
          name="file"
          onChange={(e) => {
            specialUpload(e.target.files);
          }}
        />
        <button className="upload-btn" type="submit" onClick={handleUpload}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileManagerPage;
