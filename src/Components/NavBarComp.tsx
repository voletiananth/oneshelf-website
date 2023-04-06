import {Container, Form, Nav, Navbar} from "react-bootstrap";

import '../App.scss'
import {useSelector} from "react-redux";
import './Components.css';
import {Outlet,NavLink,} from "react-router-dom";
import {AppState} from "../models/AppState";

function NavBarComp() {
    let pantry = useSelector((state: AppState) => state.pantry)
  return(
      <>
          <Navbar bg='primary' expand="lg">
              <Container>
                  <Navbar.Brand href="/home">OneShelf</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav  className="me-auto ">
                          <NavLink to="/home"

                          >Home</NavLink>
                          <NavLink to="/browse">Browse</NavLink>
                          <NavLink to="/about">About</NavLink>

                      </Nav>
                      <div className="d-flex align-items-center">
                          <p className={"pantry-name"}>{pantry?.name}</p>
                          <Form >
                              <Form.Control type="search"
                                            placeholder="Search"
                                            className="me-2"
                                            aria-label="Search"
                              />
                          </Form>
                      </div>

                  </Navbar.Collapse>
              </Container>
          </Navbar>
          <Outlet />
      </>
  );
}



export default NavBarComp
