import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Filemanager.css"; // Import the CSS file
import lighthouse from "@lighthouse-web3/sdk";

const FileManagerPage = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(true);

  const walletAddress = localStorage.getItem("WalletAddress");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/retrieve?wallet=${walletAddress}`
        );
        const filesData = response.data.fileNameToCID; // Assuming response.data contains the filename:CID pairs
        console.log(filesData);
        // Update the file URLs with IPFS gateway URLs + CIDs
        const updatedFiles = Object.entries(filesData).map(
          ([fileName, cid]) => ({
            name: fileName,
            url: `https://gateway.lighthouse.storage/ipfs/${cid}`,
          })
        );
        setFiles(updatedFiles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
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
      return;
    }
    console.log(cid, fileName);
    try {
      const postData = {
        walletAddress,
        contentID: cid,
        filename: fileName,
      };
      const response = await axios.post(
        "http://localhost:5001/api/upload",
        postData
      );
      console.log("Post request successful:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const specialUpload = async (fi) => {
    const fileNameElement = document.getElementById("fileName");
    if (fi.length > 0) {
      const fileName = fi[0].name;
      fileNameElement.textContent = "Selected file: " + fileName;
    } else {
      fileNameElement.textContent = ""; // Clear the text if no file is selected
    }
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
    if (output.data.Hash.length > 0) {
      // Do something after file upload
    }
  };

  return (
    <div className="container">
      <h2>Your Files</h2>
      <h4>Store your files encrypted on the blockchain</h4>
      {loading ? (
        <p>Loading...</p>
      ) : files.length > 0 ? (
        <div className="file-list">
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Download Link</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-files-message">
          <p>No files are saved with this address.</p>
        </div>
      )}
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          className="upload-input"
          type="file"
          name="file"
          id="fileInput"
          onChange={(e) => {
            specialUpload(e.target.files);
          }}
        />
        <label htmlFor="fileInput" className="upload-label">
          Choose File
        </label>
        <button className="upload-btn" type="submit">
          Upload File
        </button>
      </form>
      <p id="fileName"></p>

    </div>
  );
};

export default FileManagerPage;
