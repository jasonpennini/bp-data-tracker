import Papa from "papaparse";
import { useState } from "react";
import { parse } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";

const CSVImporter = () => {
  const [csvdata, setData] = useState([]);
  const { user } = useAuthContext();

  // Mapping CSV fields to DB Schema
  const mapCSVToSchema = (csvRows) => {
    return csvRows
      .map((row) => {
        // Using a ternary to check and parse date
        let parsedDate = null;
        try {
          parsedDate = row.Date
            ? parse(row.Date, "MM/dd/yyyy", new Date())
            : null;
        } catch (error) {
          console.error(`Error parsing date: ${row.Date}`, error);
        }

        return {
          player: row.Batter,
          bpType: row.TaggedHitType,
          date: parsedDate,
          exitSpeed: Number(row.ExitSpeed),
          angle: Number(row.Angle),
          direction: Number(row.Direction),
          distance: Number(row.Distance),
          autoPitchType: row.AutoPitchType,
        };
      })
      .filter(
        (data) =>
          ![data.exitSpeed, data.angle, data.direction, data.distance].some(
            (value) =>
              value === null || value === undefined || Number.isNaN(value),
          ),
      ); // Remove rows with any null, undefined, or NaN values
  };

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    //Papa is an object imported from the Papa Parse library. It parses the csv file into a Javascript-readable format
    Papa.parse(file, {
      complete: (result) => {
        // data is generally an array of objects, where each object is a row from the csv file
        const formattedData = mapCSVToSchema(result.data);
        setData(formattedData);
        // Call the function to send data to the backend
        sendDataToBackend(formattedData);
      },
      header: true,
    });
  };

  const sendDataToBackend = async (formattedData) => {
    try {
      const response = await fetch("/api/bp-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ workouts: formattedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload data");
      }

      console.log("Data uploaded successfully");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <div>
        <h3>Uploaded Data:</h3>
        <pre>{JSON.stringify(csvdata, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CSVImporter;
