import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection, // for fetching the data
    onSnapshot, //for realtime refreshing the page
    addDoc, //for adding 
    deleteDoc, // for deletion
    updateDoc, // for updation
    doc,
    query, where, // for running the queries
    orderBy,serverTimestamp, // for ordering the elements
    getDoc,

} from 'firebase/firestore'
import { // for authentications
    getAuth,
    createUserWithEmailAndPassword,
    signOut, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
}from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDLMM89qtUXSR6T2lZxzdRsVMpevRg6ydw",
    authDomain: "fir-9-dojo-b6e82.firebaseapp.com",
    projectId: "fir-9-dojo-b6e82",
    storageBucket: "fir-9-dojo-b6e82.appspot.com",
    messagingSenderId: "474268347267",
    appId: "1:474268347267:web:c9a24978e3dfb26a33e4b6"
};

// Initialize Firebase app
initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore();
const auth = getAuth()

// Collection reference
const colRef = collection(db, 'books');

//queries
//const q = query(colRef,where("author","==","priva")) // for running queries like to fetch a specific author books 
//queries --> Order By        
const q = query(colRef,orderBy('createdAt')) // for running queries like to fetch  books in an order, 
//and when you will run this it will show an error on console click on that error link and create indexing

// Get collection data
/* getDocs(colRef)
    .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        console.log(books);
    })
    .catch(err => {
        console.log("Error fetching documents:", err.message);
    }); */

//real time collection data
/*  onSnapshot(colRef,(snapshot)=>{ //now on addition and deletion we want the page to automatically refresh 
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
})  */


    //for runnig the query unComment this part and commernt the upper snapshot part
     onSnapshot(q,(snapshot)=>{ //now on addition and deletion we want the page to automatically refresh 
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        
/**other stuff */
const booksContainer = document.getElementById('booksContainer')
booksContainer.innerHTML = ''
books.forEach(book =>{
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    bookDiv.innerHTML = `<h3>${book.title}<h3/>
    <p>ID: ${book.id}<p/>`
    booksContainer.appendChild(bookDiv);
})
console.log(books);

        console.log(books);
    })

// Adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        console.log("Document successfully added!");
        addBookForm.reset();
    })
    .catch(err => {
        console.error("Error adding document:", err.message);
    });
});
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
   const docRef = doc(db,'books', deleteBookForm.id.value)
   deleteDoc(docRef)
    .then(()=>{
        deleteBookForm.reset()
    })
});

//Updating a document
const UpdateBookForm = document.querySelector('.update');
UpdateBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docRef = doc(db,'books', UpdateBookForm.id.value)
    updateDoc(docRef,{
        title: UpdateBookForm.title.value,
        author: UpdateBookForm.author.value,
        createdAt: serverTimestamp()
    })  
    .then(()=>{
        UpdateBookForm.reset()
    })
          console.log("updated");
          
});

//Fetching a single document
        const docRef = doc(db,'books','CwownCdmGbaPf5BULwmZ')
/* 
        getDoc(docRef)
            .then((doc)=>{
                console.log(doc.data(),doc.id);
                
            }) */
            //for realtime refresh
        onSnapshot(docRef, (doc)=>{
            console.log(doc.data(),doc.id);
        })


//SignUp system
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth,email, password)
    .then((cred)=>{
        console.log('user created', cred.user);
        signupForm.reset();
        
    })
    .catch((err)=>{
        console.log(err.message);
        
    })
})

//login and log out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click',()=>{
signOut(auth)
    .then(()=>{
        console.log("log off");
    })
    .catch((err)=>{
        
        console.log(err.message);
      
    })
})
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit',(e)=>{
e.preventDefault()
const email = loginForm.email.value;
    const password = loginForm.password.value;
signInWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
       // console.log('user logged', cred.user);
        loginForm.reset(); 
       // console.log("logged in");
        
        
    })
    .catch((err)=>{
        console.log(err.message);
        
    })

})

// subscribing to auth changes/ user status login or not
onAuthStateChanged(auth,(user)=>{
    console.log("user status changed",user);
    
})


//
onAuthStateChanged(auth,(user)=>{
    if (user) {
        console.log("user is logged in",user);
        authContainer.style.display = 'none';
        content.style.display = 'block'
        logoutButton.style.display = 'block'
        
    }
    else {
        console.log('User is logged out');
        authContainer.style.display = 'block';
        content.style.display = 'none';
        logoutButton.style.display = 'none';
    }
})
