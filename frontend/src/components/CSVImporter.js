import Papa from 'papaparse';
import {useState} from 'react'

const CSVImporter = () => {
  const [csvdata, setData] = useState([]);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    //Papa is an object imported from the Papa Parse library. It parses the csv file into a Javascript-readible format
    Papa.parse(file, {
      complete: (result) => {
        // data is generally an array of objects, where each object is a row from the csv file
        setData(result.data);
      },
      header: true,   
    });
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