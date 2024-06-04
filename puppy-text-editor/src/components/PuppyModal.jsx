import React, {useState} from 'react';

const PuppyModal = ({ title, onSubmit, display }) => {

  const [data, setData] = useState('');

  const handleSubmit = () => {
    onSubmit(data);
    display();
    setData('');
  }

  return (
    <>
      <div className="puppy-modal-overlay">
        
        <div className="puppy-modal-body">

          <div className="puppy-modal-head">
            {title}
          </div>

          <div className="puppy-modal-content">
            <input type="text" className='puppy-form-text' autoFocus onChange={(e)=>setData(e.target.value)} />
          </div>

          <div className="puppy-modal-buttons-group">
            <button type='button' className='puppy-btn puppy-btn-primary' onClick={(e)=>handleSubmit()}>Submit</button>
            <button type='button' className='puppy-btn puppy-btn-danger' onClick={(e)=>display()}>Close</button>
          </div>


        </div>

      </div>
    </>
  )

}

export default PuppyModal;