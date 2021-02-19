import axios from 'axios'; 
  
import React,{Component} from 'react'; 
import * as XLSX from 'xlsx';
import { CSVLink } from "react-csv";

  
class Test extends Component { 
   
    state = { 
  
      // Initially, no file is selected 
      selectedFile: null,
      data:[],
      userInput:[],
      headers :[
        { label: "id", key: "id" },
        { label: "userId", key: "userId" },
        { label: "status", key: "test" },
        { label: "title", key: "title" },
        { label: "completed", key: "completed" }
      
        ],
      filteredArray:[]
      
    }; 

    componentDidMount(){
        this.getData();
      }

      getData(){
        fetch('https://jsonplaceholder.typicode.com/todos/')
  .then(response => response.json())
  .then(json => this.setState({data :json}))

      }
    
    
     
    // On file select (from the pop up) 
    onFileChange = event => { 
     
      // Update the state 
      this.setState({ selectedFile: event.target.files[0] }); 

      alert(this.state.data.length)
     
    }; 
     
    
    handleUpload = (e) => {
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        var dataParse=[]
        reader.onload = (e) =>{
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
    
            /* Convert array to json*/
             dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
             this.setState({userInput:dataParse}, () =>{
                this.printInfo(dataParse)
            })
            
        };
      
console.log(dataParse)
        reader.readAsBinaryString(f)
    }
   
    printInfo =(userdata) =>{

        console.log(" Api data")
        console.log(this.state.data);
        console.log(" user Input")
        console.log(userdata);
        console.log("deffer two arrays here")

        const myArrayFiltered = this.state.data.map( el => {
             if(userdata.find(f => f == el.id)){
                 el.test ="valid";
                 return el;
             } else{
                el.test ="In valid";
                return el;
             }

          });
          
            console.log(myArrayFiltered)
          this.setState({filteredArray:myArrayFiltered});
            alert("now click download link")


    }
    
    // On file upload (click the upload button) 
    onFileUpload = () => { 
     
        console.log(this.state.data)
      // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "myFile", 
        this.state.selectedFile, 
        this.state.selectedFile.name 
      ); 
     
      // Details of the uploaded file 
      console.log(this.state.selectedFile); 
     
      // Request made to the backend api 
      // Send formData object 
      axios.post("api/uploadfile", formData); 
    }; 
     
    // File content to be displayed after 
    // file upload is complete 
    fileData = () => { 
     
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
              {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
          </div> 
        ); 
      } 
    }; 
     
    render() { 
     
      return ( 
        <div> 
            <h1> 
              FileUpload  POC
            </h1> 
            <h3> 
              File Upload using React! 
            </h3> 
            <div> 
                <input type="file" onChange={this.handleUpload} /> 
                {/* <button onClick={this.onFileUpload}> 
                  Upload! 
                </button>  */}
                <CSVLink data={this.state.filteredArray} headers={this.state.headers}>
  Download me
</CSVLink>
            </div> 
          {this.fileData()} 
        </div> 
      ); 
    } 
  } 
  
  export default Test; 
