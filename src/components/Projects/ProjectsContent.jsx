import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Table,
  Dropdown,
} from "react-bootstrap";
import "./project.css";
import { Link } from 'react-router-dom';
import { CiFilter } from "react-icons/ci";
import ProjectForm from "./ProjectForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { MDBTable, MDBTableBody } from 'mdbreact';
import {BsPencilSquare,BsFillTrash3Fill,BsJustify} from 'react-icons/bs'
import { addProject, deleteProject, getallProjects, updateProject } from "../../service/allapi";
import { capitalize } from "@mui/material";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineFilterAlt } from "react-icons/md";

// ProjectsContent component definition
export const ProjectsContent = ({OpenSidebar}) => {

//for delete confirm modal
 const [smShow, setSmShow] = useState(false);

  // State management for form visibility, projects data, and editing project
  const [isFormOpen, setFormOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('projectName'); 
  const [filterText, setFilterText] = useState('Filter'); 

      //for pagenation
      const [currentPage,setCurrentPage] = useState(1)
      const recordsPerPage = 8;
      const lastIndex = currentPage * recordsPerPage;
      const firstIndex = lastIndex - recordsPerPage;
      const records = projects.slice(firstIndex, lastIndex);
      const npages =Math.ceil(projects.length / recordsPerPage);
      const numbers = [...Array(npages+1).keys()].slice(1)

  // Function to open the project form
  const openForm = (project) => {
    setProjectToEdit(project);
    setFormOpen(true);
  };

  // Function to close the project form
  const closeForm = () => {
    setProjectToEdit(null);
    setFormOpen(false);
  };

  // Function to call the API and get all projects
  const getAllProjects=async()=>{
    const response=await getallProjects(projects)
    setProjects(response.data)
    console.log(projects);
  }

  // Function to handle adding or editing a project
  const handleAddProject = async (newProject, isEdit) => {
    // Capitalize the first letter of projectName, clientName, projectType, and resources
    newProject.projectName = capitalize(newProject.projectName);
    newProject.clientName = capitalize(newProject.clientName);
    newProject.projectType = capitalize(newProject.projectType);
    newProject.resources = capitalize(newProject.resources);
  
    try {
      if (isEdit) {
        // If editing, make an API call to update the project
        const response = await updateProject(newProject._id, newProject);
        console.log(response);
  
        if (response && response.status === 200) {
          // Update the corresponding project in the state
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === newProject._id ? newProject : project
            )
          );
          toast.success(response.data && response.data.message);
        } else {
          toast.error(response && response.data && response.data.message || 'Unknown error occurred');
        }
      } else {
        // If adding new, make an API call to add the project
        const response = await addProject(newProject);
        if (response && response.status === 200) {
          // Add the new project to the state with the returned id
          setProjects((prevProjects) => [
            ...prevProjects,
            { ...newProject, id: response.data && response.data.id },
          ]);
          toast.success(response.data && response.data.message);
        } else {
          toast.error(response && response.data && response.data.message || 'Unknown error occurred');
        }
      }
    } catch (error) {
      console.error('Error updating/adding project:', error);
      toast.error('Error updating/adding project. Please try again.');
    }
  };
  
  



  //function for delete Project
  const handleDeleteProject = async(id) => {

    //api call for delete Projct
    const response = await deleteProject(id)
    if (response.status == 200) {
      toast.success(response.data.message);
      setSmShow(false)
      getAllProjects()
    
    }else{
     
      toast.error(response.data.message);
    }
  }
  // Function to handle filter type selection
  const handleFilterSelect = (type, text) => {
    setFilterType(type);
    setFilterText(text);
  };

  const PlaceholderWithIcon = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IoSearchSharp />
      <span style={{ marginLeft: '5px' }}>Search...</span>
    </div>
  );


  // useEffect hook to fetch all projects on component mount
  useEffect(() => {
    getAllProjects();
  }, []);

  // JSX rendering
  return (
    <Container>
      <Row className="mb-3">
        <Col className="text-start">
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
          <h1 className="mb-4">Projects</h1>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => openForm(null)} style={{ fontSize: "17px", width: "150px" }}>
            Add Project
          </Button>
        </Col>
        <Row className="mb-2 justify-content-start">
          <Col md="auto" className="text-start">
            <Dropdown className="hov">
              <Dropdown.Toggle
               style={{
                fontSize: "16px",
                padding:"7px",
                backgroundColor: "#f5f0f0",
                color: "rgb(50, 49, 49)",
                border:"none",
                fontWeight:"normal"
                }} 
                id="dropdown-basic"
              >
             <MdOutlineFilterAlt id="filter-icon"  /> {filterText}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleFilterSelect('projectName', 'Project Name')}>Project Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('clientName', 'Client Name')}>Client Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('startDate', 'Start Date')}>Start Date</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('endDate', 'End Date')}>End Date</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md="auto" className="text-start ">
          <div className="input-wrapper hov">
        <IoSearchSharp id="search-icon" />
        <input 
          type="text" 
          placeholder="Search"
          style={{ width: "200px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}

          /> 
          </div>
          </Col>
        </Row>
      </Row>
      <MDBTable responsive className="p-3 h">
      <thead className="tp" >
      <tr   >
        <th style={{backgroundColor:"#450c36", color:"white",
        borderTopLeftRadius:"10px",borderBottomLeftRadius:"10px"}} className="p-4" >Project Name </th>
        <th style={{backgroundColor:"#450c36", color:"white",}}  className="p-4" >Client Name</th>
        <th style={{backgroundColor:"#450c36", color:"white"}}  className="p-4" >Start Date
        <div className="arrow">
         <div class="up-arrow" onclick="clickupArrow()">

         </div>
         <div class="down-arrow" onclick="clickDownArrow()">

        </div>
         </div>
        </th>
        <th style={{backgroundColor:"#450c36", color:"white"}}  className="p-4" >End Date
        <div className="arrow">
         <div class="up-arrow" onclick="clickupArrow()">

         </div>
         <div class="down-arrow" onclick="clickDownArrow()">

        </div>
         </div>
        </th>
        <th style={{backgroundColor:"#450c36", color:"white"}}  className="p-4" >Proj.Type</th>
        <th style={{backgroundColor:"#450c36", color:"white"}}  className="p-4" >#Resources</th>
        <th style={{backgroundColor:"#450c36", color:"white",
        borderTopRightRadius:"10px",borderBottomRightRadius:"10px"}}  className="p-4" >Actions</th>
      
      </tr>
     </thead>
      <MDBTableBody>
          {records.filter((item) => {
            const searchTerm = search.toLowerCase();
            const projectValue = item[filterType].toLowerCase();
            return projectValue.includes(searchTerm);
          }).map((project, index) => (
            <tr >
              <td>{project.projectName}</td>
              <td>{project.clientName}</td>
              <td>{moment(project.startDate).format("DD-MM-YYYY")}</td>
              <td>{moment(project.endDate).format("DD-MM-YYYY")}</td>
              <td>{project.projectType}</td>
              <td>{project.resources}</td>
      
              <td className="ho"><Link><a style={{color:"#450c36"}}><BsPencilSquare onClick={() => openForm(project)} className=' ms-1 icon'/></a>
              </Link> <a style={{color:"#450c36"}}><BsFillTrash3Fill onClick={() => setSmShow(true)} className='ms-2 icon'/></a>
              <Modal 
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body ><h5 className="text-center" style={{marginTop:'-40px'}}>Are u want to Delete ?</h5></Modal.Body>
        <Modal.Footer style={{marginTop:'-25px'}} >
          <Button variant="secondary" style={{ borderRadius: '10px',
          color:"white",marginLeft:"-50px"}} onClick={() => setSmShow(false)}>Close</Button>
          <Button variant="dark" style={{ borderRadius: '10px',
          color:"white"}}  onClick={() => handleDeleteProject(project._id) }>Confirm</Button>
        </Modal.Footer>
      </Modal>
</td>
      
           
            </tr>
            ))}
       </MDBTableBody>
    </MDBTable>
    <nav className=' fs-5 p-4 ' >
    <ul className='pagination  '>
    
      {
        numbers.map((n, i)=>(
          <li className={`page-item ${currentPage === n ? 'active' : ''}`}key={i}>
            <a className='page-link '  onClick={()=>changeCpage(n)}>{n}</a>
          </li>

        ))
      }
   
    </ul>
  </nav>
      <ProjectForm show={isFormOpen} handleClose={closeForm} handleAddProject={handleAddProject} projectToEdit={projectToEdit} />
      <ToastContainer autoClose={500}   position="top-center" />
    </Container>
  );
  //for pagenation

  function changeCpage(id){
    setCurrentPage(id)

  }
};
export default ProjectsContent