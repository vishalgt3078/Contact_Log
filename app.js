
import {getFirestore, collection, addDoc,onSnapshot, doc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db=getFirestore();
const dbRef=collection(db,"contacts");
// GET DATA
let contacts=[];

//MObile 

const leftCol=document.getElementById("left-col");
const rightCol=document.getElementById("right-col");
const backBtn=document.getElementById("back-btn");

backBtn.addEventListener("click",e=>{
    leftCol.style.display="block";
    rightCol.style.display="none";
})
const ToggleLeftonMobile=()=>{
     if(document.body.clientWidth <=600){
        leftCol.style.display="none";
        rightCol.style.display="block";
     }
}

const getContacts=async()=>{
    

    try{
        // const docsSnap=await getDocs(dbRef);
        await onSnapshot(dbRef, docsSnap=>{
            contacts=[];
            docsSnap.forEach((doc)=>{
                const contact=doc.data();
                contact.id=doc.id;
                contacts.push(contact);
                
    
               
            //    console.log(doc.data());
            })
            showContacts(contacts);
            console.log(contacts);
        });
  
    } catch(err){
       console.log("getContacts="+err);
    }
    

}
getContacts();

const contactList= document.getElementById("contact-list");

  const showContacts=(contacts)=>{
       contactList.innerHTML="";
       contacts.forEach(contact=>{
        const li=`<li class="contact-list-item" id="${contact.id}">
        <div class="media">
            <div class="two-letter">AB</div>
        </div>
        <div class="contact">
            <div class="title">
               ${contact.firstName} ${contact.lastName}
            </div>
            <div class="subtitle">${contact.email}</div>
        </div>
        <div class="action">
            <button class="edit-user">edit</button>
            <button class="delete-user">delete</button>
        </div>
    </li>`;

    contactList.innerHTML +=li;
       });
  }

  const displayContactOnDetailsView=(id)=>{
    // const contact=getContacts(id);
    const contact=contacts.find(contact=>{
        return contact.id===id;
       });
    
    const rightColDetail=document.getElementById("right-col-detail");
    rightColDetail.innerHTML= `
    <div class="label">Name:</div>
    <div class="data"> ${contact.firstName} ${contact.lastName}</div>
    <div class="label">Age:</div>
    <div class="data">${contact.Age}</div>
    <div class="label">Phone:</div>
    <div class="data">${contact.phone}</div>
    <div class="label">Email:</div>
 <div class="data">${contact.email}</div>

    `;
}
   const editButtonPressed=(id)=>{
    modalOverlay.style.display="flex";
    const contact=contacts.find(contact=>{
        return contact.id===id;
       });
    console.log(contact);
    firstname.value=contact.firstName;
    lastname.value=contact.lastName;
    age.value=contact.Age;
    phone.value=contact.phone;
    mail.value=contact.email;
    modalOverlay.setAttribute("contact-id",contact.id);
   }

   
   const deleteButtonPressed=async (id)=>{

   const isConfirmed= confirm("Are you sure to Delete this contact?");
    if(isConfirmed){
        try{
            const docRef= doc(db,"contacts",id);
         await deleteDoc(docRef);
    
         }
         catch(e){
            setErrorMessage("error","unable to delete data");
                  showErrorMessages();
         }
    }
     
      
   }

  const contactListPressed=(event)=>{
     const id=event.target.closest("li").getAttribute("id");
     console.log(id);
     if(event.target.className==="edit-user"){
         editButtonPressed(id);
     }
     else if(event.target.className==="delete-user"){
        deleteButtonPressed(id);
     }
     else {
        displayContactOnDetailsView(id);
        ToggleLeftonMobile();
     }
    //  displayContactOnDetailsView(id);
  }
  contactList.addEventListener("click", contactListPressed);
  const getContact=(id)=>{
    const contact=contacts.find(contact=>{
        return contact.id===id;
       });
   }


  
const addBtn=document.querySelector(".add-btn");
const modalOverlay=document.getElementById("modal-overlay");
const closeBtn=document.querySelector(".close-btn");
const addButtonpressed=()=>{
     modalOverlay.style.display="flex";
     modalOverlay.removeAttribute("contact-id");
     firstname.value="";
     lastname.value="";
     age.value="";
     phone.value="";
     mail.value="";


     
}
addBtn.addEventListener("click",addButtonpressed);
const closeButtonPressed= ()=>{
    modalOverlay.style.display="none";
}
closeBtn.addEventListener("click",closeButtonPressed);
const hideModal=(e)=>{

    if(e instanceof Event){
        if(e.target===e.currentTarget){
            modalOverlay.style.display="none";
    }
    
    }
    else {
        modalOverlay.style.display="none";
    }
}

modalOverlay.addEventListener("click",hideModal);

const saveBtn=document.querySelector(".save-btn");
const error={};

const firstname=document.getElementById("firstName"),
      lastname=document.getElementById("lastName"),
      age=document.getElementById("Age"),
      phone=document.getElementById("Phone"),
      mail=document.getElementById("mail");
    
const saveBtnPressed=async()=>{
    checkRequired([firstname,lastname,mail,age,phone]);
    checkEmail(mail);
    checkInputLength(age,2);
    checkInputLength(phone,10);
    showErrorMessages(error);
   
    if(Object.keys(error).length===0){
        if(modalOverlay.getAttribute("contact-id")){
        const docRef=  doc(db,"contacts",modalOverlay.getAttribute("contact-id"));
             try{
                await  updateDoc(docRef,{
                    firstName:firstname.value,
                    lastname:lastname.value,
                    Age:age.value,
                    phone:phone.value,
                    email:mail.value
    
                 });

                 hideModal();
             }
             catch(e){
              setErrorMessage("error","unable to add data");
              showErrorMessages();
             }
           
        }
        else {
            try{
                await addDoc(dbRef,{
                    firstName:firstname.value,
                    lastName:lastname.value,
                    Age: age.value,
                    phone: phone.value,
                    email:mail.value
        
                });
                hideModal();
            }
            catch(err){
              setErrorMessage("error","unable to add data");
              showErrorMessages();
            }
        }
        
        
    }

}

const checkRequired=(inputArray)=>{
      inputArray.forEach(input => {
           if(input.value.trim()===""){
           setErrorMessage(input,input.id+ " is empty");
           }
           else{
            delete error[input.id];
           }
           console.log(error);
      });

     
}
 const setErrorMessage=(input, message)=>{
    if(input.nodeName==="INPUT") {
        error[input.id] =message;
        input.style.border="1px solid red";
    }
    else{
        error[input]=message;
    }
    
 }
    const deleteErrorMessage=(input)=>{
        delete error[input.id];
        input.style.border="1px solid green";
    }

   const checkInputLength=(input, number)=>{
    if(input.value.trim()!==""){
        if(input.value.trim().length===number){
            deleteErrorMessage(input);
        }
        else {
            setErrorMessage(input,input.id+` must be ${number} digits`);
        }}
   }
    const checkEmail=(input)=>{
        if(input.value.trim()!==""){
        const re= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(re.test(input.value.trim())){
            delete error[input.id];
        }
        else {
            setErrorMessage(input,input.id+ " is invalid");
        }
    }
    }
const showErrorMessages=()=>{
    const errorlabel=document.getElementById("error-label");
    errorlabel.innerHTML="";
    for(const key in error){
      const li=  document.createElement("li");
      li.innerText= error[key];
      li.style.color="red";
      errorlabel.appendChild(li);
    } 
}

saveBtn.addEventListener("click", saveBtnPressed);