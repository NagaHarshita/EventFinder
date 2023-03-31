import React, {Component} from 'react';

class NotFound extends Component{
    render() {
      return (
        <div >
          <div className="section portfolio-section" style={{backgroundColor:'#CFECEC'}}>
          <div className="container">
              <div className="row mb-5 justify-content-center" data-aos="fade-up">
                <div className="col-md-8 text-center">
                <img alt="" src="images/icons/icons8-broken-link-100.png" height="200px" width="200px"/>
                  <h1>Oops! 404 page </h1>
                </div>
              </div>
          </div>
          </div>
        </div>
          
      );
    }
  }

  export default NotFound;