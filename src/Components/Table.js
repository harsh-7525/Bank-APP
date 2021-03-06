import React from "react";
import "./Table.css";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      displayAll:false,
      banks: [],
      search:"",
      limit:10,
      search_limit:10,
      visibility:false,
      show_menu:false,
      selected_menu:"CITIES"
    };
    this.show_dropdown=this.show_dropdown.bind(this);
    this.hide_dropdown=this.hide_dropdown.bind(this);
  }
  //Event Handler for Drop Down
  show_dropdown(event){
    event.preventDefault();
    this.setState({
      show_menu:true
    }, ()=> {
      document.addEventListener('click',this.hide_dropdown);
    })
  }
  hide_dropdown(){
    this.setState({show_menu:false},()=>{
      document.removeEventListener('click',this.hide_dropdown)
    })
  }
  //Data update
  componentDidMount() {
    let ct = ["BANGALORE", "CHENNAI", "DELHI", "HYDERABAD", "INDORE"];
    let url = "https://vast-shore-74260.herokuapp.com/banks?city=";
      for (let i = 0; i < ct.length; i++) {
        let curl = url + ct[i];
        fetch(curl)
          .then(res => res.json())
          .then(json => {
            this.setState({
              isLoaded: true,
              banks: json
            });
          });
      }
      this.setState({
        menu:this.props.menu
      })
  }
  //Load More
  load(){
    this.setState({
      limit:this.state.limit+10
    })
  }
  //Search by Bank Name, City, State
  Search(e){
    this.setState({
      search:e.target.value.toUpperCase()
    })
  }
  //City Selection
  selectMenu(str){
    let curl = "https://vast-shore-74260.herokuapp.com/banks?city="+str;
    fetch(curl)
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          banks: json
        });
      });
    this.setState({
      selected_menu:"SELECTED CITY : "+str
    })
  }
  render() {
    const { error, isLoaded, banks, search } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
        <div className="loader">Loading...</div>
        <center><h1 className="wait">Please wait...</h1></center>
        </div>
      );
    } else {

      return (
        <div>
          {/*Drop Down */}
          <ul className='menu'>
        <li id='main-menu' onClick={this.show_dropdown}>{this.state.selected_menu}
        <div className="menu-icon">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
        </div>
        </li>
          {this.state.show_menu?
              (<ul className='dropdown'>
                <li onClick={()=>this.selectMenu("BANGALORE")}>BANGALORE</li>
                <li onClick={()=>this.selectMenu("CHENNAI")}>CHENNAI </li>
                <li onClick={()=>this.selectMenu("DELHI")}>DELHI</li>
                <li onClick={()=>this.selectMenu("HYDERABAD")}>HYDERABAD</li>
                <li onClick={()=>this.selectMenu("INDORE")}>INDORE</li>
              </ul>)
              :(null)}
          </ul>
          {/*DropDown*/}
          <center><input type="text" placeholder="Search here" className="search" onChange={ e=>this.Search(e) }></input></center>
          <table className="bd">
            <thead>
              <tr>
                <th>Bank IFSC</th>
                <th>Bank Name</th>
                <th>Bank ID</th>
                <th>Bank Branch</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {
                banks.filter(bank =>{
                  return bank.bank_name.indexOf(search) >=0 || bank.branch.indexOf(search) >=0 
                }).slice(0,this.state.limit).map(bank => (
                  <tr>
                    <td>{bank.ifsc}</td>
                    <td>{bank.bank_name}</td>
                    <td>{bank.bank_id}</td>
                    <td>{bank.branch}</td>
                    <td>{bank.address}</td>
                    <td>{bank.city}</td>
                    <td>{bank.state}</td>
                  </tr>
                ))
              }
            </tbody>
            </table>
            <center><button className="load" onClick={()=> this.load()}>Load More</button></center>
          </div>
      );
    }
  }
}
export default Table;
