import React from 'react';
import { Container, Image } from 'semantic-ui-react';
import logo from "./assets/ntherm_clear_bg.png";
import './CSS/Header.css';

function Header() {
  return (
    <div className="header-container" style={{ backgroundColor: 'rgba(255, 0, 0, 0.8)', padding: '15px 0', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999 }}>
      <Container className="logo-container">
        <Image className="logo-img" src={logo} size='small' />
      </Container>
    </div>
  );
}

export default Header;
