// Importing necessary dependencies
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";
import "./project.css";
import { CiFilter } from "react-icons/ci";
import ProjectForm from "./ProjectForm";
import { getallProjects } from "../../service/allapi";

// ProjectsContent component definition
export const ProjectsContent = () => {
  // State management for form visibility, projects data, and editing project
  const [isFormOpen, setFormOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('projectName'); 
  const [filterText, setFilterText] = useState('Filter'); 

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
  const getAllProjects = async () => {
    const response = await getallProjects(userData);
    setProjects(response.data);
  };

  // Function to handle adding or editing a project
  const handleAddProject = (newProject, isEdit) => {
    // Capitalize the first letter of projectName, clientName, projectType, and resources
    newProject.projectName = capitalizeFirstLetter(newProject.projectName);
    newProject.clientName = capitalizeFirstLetter(newProject.clientName);
    newProject.projectType = capitalizeFirstLetter(newProject.projectType);
    newProject.resources = capitalizeFirstLetter(newProject.resources);

    // Format startDate and endDate as "dd/mm/yyyy"
    newProject.startDate = formatDate(newProject.startDate);
    newProject.endDate = formatDate(newProject.endDate);

    // Update projects array based on whether it's an edit or addition
    if (isEdit) {
      const updatedProjects = projects.map((project) =>
        project.id === projectToEdit.id ? newProject : project
      );
      setProjects(updatedProjects);
    } else {
      setProjects((prevProjects) => [
        ...prevProjects,
        { ...newProject, id: Date.now() },
      ]);
    }
  };

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to handle project deletion
  const handleDeleteProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  // Function to handle filter type selection
  const handleFilterSelect = (type, text) => {
    setFilterType(type);
    setFilterText(text);
  };

  // Helper function to format date as "dd/mm/yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // useEffect hook to fetch all projects on component mount
  useEffect(() => {
    getAllProjects();
  }, []);

  // JSX rendering
  return (
    <Container>
      <Row className="mb-3">
        <Col className="text-start">
          <h1 className="mb-4">Projects</h1>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => openForm(null)} style={{ fontSize: "17px", width: "150px" }}>
            Add Project
          </Button>
        </Col>
        <Row className="mb-2 justify-content-start">
          <Col md="auto" className="text-start">
            <Dropdown>
              <Dropdown.Toggle
                style={{ fontSize: "15px", backgroundColor: "rgb(201, 192, 192)", color: "black" }}
                id="dropdown-basic"
              >
                <CiFilter /> {filterText}
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
            <Form.Control onChange={(e) => setSearch(e.target.value)} type="text" placeholder="🔍Search..." style={{ width: "200px" }} />
          </Col>
        </Row>
      </Row>
      <div className="table-container">
        <div className="table-heading">
          <div className="table-cell">Project Name</div>
          <div className="table-cell">Client Name</div>
          <div className="table-cell">Start Date</div>
          <div className="table-cell">End Date</div>
          <div className="table-cell">Project Type</div>
          <div className="table-cell">Resources</div>
          <div className="table-cell">Action</div>
        </div>
        <div className="table-body">
          {projects.filter((item) => {
            const searchTerm = search.toLowerCase();
            const projectValue = item[filterType].toLowerCase();
            return projectValue.includes(searchTerm);
          }).map((project, index) => (
            <div key={index} className="table-row">
              <div className="table-cell">{project.projectName}</div>
              <div className="table-cell">{project.clientName}</div>
              <div className="table-cell">{project.startDate}</div>
              <div className="table-cell">{project.endDate}</div>
              <div className="table-cell">{project.projectType}</div>
              <div className="table-cell">{project.resources}</div>
              <div className="table-cell">
                <Button variant="dark" style={{ fontSize: "12px" }} onClick={() => openForm(project)}>
                  Edit
                </Button>{" "}
                <Button variant="secondary" style={{ fontSize: "12px" }} onClick={() => handleDeleteProject(index)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProjectForm show={isFormOpen} handleClose={closeForm} handleAddProject={handleAddProject} projectToEdit={projectToEdit} />
    </Container>
  );
};
