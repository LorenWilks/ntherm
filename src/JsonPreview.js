// import React from 'react';

// class JsonPreview extends React.Component {
//   state = {
//     jsonData: this.props.jsonData,
//   };

//   handleChange = (event) => {
//     const editedJson = event.target.value;
//     try {
//       const parsedJson = JSON.parse(editedJson);
//       this.setState({ jsonData: parsedJson });
//     } catch (error) {
//       console.error('Invalid JSON input');
//       // Display an error message to the user
//     }
//   };
  

//   handleSubmit = () => {
//     this.props.onSubmit(this.state.jsonData);
//   };

//   render() {
//     return (
//       <div className="json-preview">
//         <h3>JSON Preview</h3>
//         <textarea
//           className="json-preview__textarea"
//           value={JSON.stringify(this.state.jsonData, null, 2)}
//           onChange={this.handleChange}
//         />
//         <button className="json-preview__submit-button" onClick={this.handleSubmit}>
//           Save JSON
//         </button>
//       </div>
//     );
//   }
// }

// export default JsonPreview;
