import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';


function AddEditCompany(props) {
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const storedToken = localStorage.getItem("authToken");

  const getCompany = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/mycompany`,
        { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((response) => {
        const oneCompany = response.data;

        if (typeof (oneCompany._id) !== "undefined") {
          setCompanyId(oneCompany._id);
        }
        setName(oneCompany.name);
        setJobs(oneCompany.jobs);
        setDescription(oneCompany.description);
        setAddress(oneCompany.address);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getCompany();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg("");

    const requestBody = {
      name,
      jobs,
      description,
      address
    }

    if (companyId === "") {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/companies`,
          requestBody,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then((response) => {
          const newCompanyId = response.data._id;
          navigate(`/companies/${newCompanyId}`);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/companies/${companyId}`,
          requestBody,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then((response) => {
          console.log(response)
          const companyId = response.data._id;
          navigate(`/companies/${companyId}`);
        })
        .catch((error) => console.log(error));
    }

  };

  const deleteCompany = () => {
    // Make a DELETE request to delete the company
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/companies/${companyId}`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => {
        // Once the delete request is resolved successfully
        navigate("/");
      })
      .catch((err) => console.log(err));
  };


  return (
    <div className="text-center">

      <div className="p-5 bg-image" style={{ backgroundImage: `url(job-somely-header2.png)`, height: '300px', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }} />


      <div className="card mx-4 mb-5 mx-md-5 bg-light bg-opacity-75 shadow-5-strong shadow-lg" id="no-scale" style={{ marginTop: "-100px", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(30px)" }}>
        <div className="card-body py-5 px-md-5">

          <div className="row d-flex justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4">Company Profile</h2>
              {errorMsg &&
                <p classNameName="error">
                  {errorMsg}
                </p>
              }
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-outline mb-4">
                    <div className="form-outline">
                      <label className="form-label">Company Name</label>
                      <input type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-outline mb-4">
                    <div className="form-outline">
                      <label className="form-label">Company Description</label>
                      <textarea
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} cols="30" rows="6" wrap="hard" className="form-control" required />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-outline mb-4">
                    <div className="form-outline">
                      <label className="form-label">Company Location</label>
                      <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} className="form-control" required />
                    </div>
                  </div>
                </div>
                <div>
                  <Button className="bg-gradient text-white px-3 mx-4 mb-4" variant="danger" onClick={deleteCompany}>Delete The Company Profile</Button>
                  <Button type="submit"
                    className="bg-gradient text-white px-5 mb-4">Save Changes</Button>
                </div>
                <div>
                  <NavLink to="/jobs/create">
                    <Button className="px-5 text-white bg-gradient">Add jobs</Button>
                  </NavLink>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default AddEditCompany;