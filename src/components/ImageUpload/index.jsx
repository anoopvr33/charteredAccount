import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./style.css";
import * as XLSX from "xlsx";
import Tables from "../Tables";

const ImageUpload = () => {
  const imageref = useRef();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoad] = useState({ color: "red", active: false });
  const [data, setData] = useState([]);

  const OnFile = () => {
    imageref.current.click();
  };

  const onFileUpload = async (e) => {
    const file = Array.from(e.target.files);

    if (file) {
      const file = e.target.files[0];

      setImage(file);
      setPreview(() => URL.createObjectURL(file));
      //  for array of images

      // setImage((prev) => [...prev, ...file]);

      // Generate previews
      // const previewUrls = file.map((file) => URL.createObjectURL(file));
      // setPreview((prev) => [...prev, ...previewUrls]);

      //
    }
  };

  const onSubmit = async () => {
    if (!image) {
      return alert("upload image");
    }

    setLoad({ color: "red", active: true });
    const formData = new FormData();

    // image.forEach((file, i) => {
    //   formData.append("image", file);
    // });

    if (image) {
      formData.append("file", image);
    }

    try {
      //send image for scan

      const response = await axios.post(
        "http://69.62.81.188:8080/extract_invoice_table",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response data", response);

      //get table contents

      if (response.data.job_id) {
        setLoad({ color: "rgb(164, 139, 255)", active: true });

        const getData = await axios.get(
          `http://69.62.81.188:8080/status/${response.data.job_id}`
        );

        if (getData.data.status == "completed") {
          setLoad({ active: false });
          setData(getData.data.result.table_data);
        } else if (getData.data.status == "failed") {
          console.log("compilation failed");
        }

        return;
      }
    } catch (e) {
      console.log("error", e);
    }
    return;
  };

  const downloadExcel = () => {
    if (!data || data.length === 0) return;

    // Convert JSON → worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Trigger file download
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  useEffect(() => {
    console.log("load", loading);
    console.log("my map", data);
  }, [loading, preview]);

  return (
    <>
      <div className="image-upload">
        <div className="heads-1">
          <h1>Upload Your Files</h1>
          <p>Convert your Bills to XLSX</p>
        </div>

        <div className="image-map">
          {preview === null ? (
            <button onClick={OnFile}>
              <img className="icon" src="/freepik__talk__45987s.png" alt="" />{" "}
              <h2>Upload Images</h2>
            </button>
          ) : (
            <picture>
              <i onClick={() => setPreview(null)} class="fa-solid fa-xmark"></i>
              <img className="bills-img" src={preview} alt="" />
            </picture>

            // preview.map((i, idx) => <img className="bills-img" src={i} alt="" />)
          )}
        </div>
        <div className="btns">
          <button onClick={onSubmit}>Submit Files</button>
        </div>

        {/* <img src={preview} alt="" /> */}
        <input
          style={{ display: "none" }}
          ref={imageref}
          // disabled
          onChange={onFileUpload}
          multiple
          type="file"
          name=""
          id=""
        />
        {/* <button>select</button> */}
      </div>
      {loading.active ? (
        <div
          style={{
            // backgroundColor: "red",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="spinner"
        >
          <CircularProgress
            sx={{ color: loading.color }}
            enableTrackSlot
            size="3rem"
          />
          <p style={{ color: "rgba(124, 90, 245, 0.5)" }}>just a few seconds</p>
        </div>
      ) : (
        ""
      )}

      {data.length > 0 && (
        <Tables
          onRemove={() => setData([])}
          onClick={downloadExcel}
          data={data}
        ></Tables>
      )}
    </>
  );
};

export default ImageUpload;
