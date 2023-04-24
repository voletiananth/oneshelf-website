import {Container, Form, Nav, Navbar} from "react-bootstrap";

import '../App.scss'
import {useSelector} from "react-redux";
import '../css/Components.css';
import {Outlet, NavLink, useNavigate,} from "react-router-dom";
import {AppState} from "../models/AppState";
import {CartButton} from "./CartButton";

function NavBarComp() {
    let pantry = useSelector((state: AppState) => state.pantry)
    let cart = useSelector((state: AppState) => state.cart)
    let navigate = useNavigate();
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
                          <div style={{marginLeft:"10px"}}>
                              <CartButton  navigator={navigate} cart={cart} />
                          </div>

                      </div>

                  </Navbar.Collapse>
              </Container>
          </Navbar>
          <Outlet />
      </>
  );
}



export default NavBarComp
