const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupBoxTitle = popupBox.querySelector("p");
const closeIcon = document.querySelector("header i"); 
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");
const addBtn = document.querySelector("button");

// get localStorage if it is existed and parse it to js object 
// else pass an empty array to notes
const notes=JSON.parse(localStorage.getItem("notes") || "[]");
let index=Number(JSON.parse(localStorage.getItem("index") || "0"));

const Months=["Jan","Feb","Mar","Apr","May","Jun","Jul",
                "Aug","Sep","Oct","Nov","Dec"];

// popup addBox
addBox.addEventListener("click",()=>{
    titleTag.focus();
    titleTag.value="";
    descTag.value="";
    popupBoxTitle.innerHTML="Add a new note";
    addBtn.innerHTML="Add note";
    popupBox.classList.add("show");
});

// close popup addBox
closeIcon.addEventListener("click",()=>{
    popupBox.classList.remove("show");
    updateElement=null;
});

// add notes from localStorage to HTML
function showNotes()
{
    notes.forEach((note)=>{
        addNote(note);
    });
}
showNotes();

// add note to HTML
function addNote(note){
    let desc=note.desc.replaceAll('\n','<br>');
    //console.log(desc);
    //console.log(note.desc);
    let newNote=`<li class="note" id="note-${note.id}">
                    <div class="details">
                        <p>${note.title}</p>
                        <span>${desc}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                            <i id="menu-${note.id}" class="uil uil-ellipsis-h"></i>
                            <ul class="menu">
                                <li onclick="updateNote(${note.id},'${note.title}','${desc}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteNote(${note.id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend",newNote);
}

// add or remove show class from note 
let menuElement=null; // save the element of menu being shown
document.addEventListener("click",(event)=>{ 
    if (menuElement!=null) 
    {
        menuElement.classList.remove("show");
        menuElement=null;
    }
    if (event.target.id.startsWith("menu"))
    {
        menuElement=event.target.parentElement;
        menuElement.classList.add("show");
    }
})
 
// delete note
function binary_search(notes,note_id)
{
    let l=0;
    let r=notes.length-1;
    let ans=0;
    while (l<r)
    {
        let mid=Math.ceil((l+r)/2);
        if (notes[mid].id<=note_id)
        {
            ans=mid;
            l=mid+1;
        }
        else r=mid-1;
    }
    return ans;
}
function deleteNote(idx){
    let noteId="note-"+idx;
    
    // remove element from HTML
    document.querySelector("#"+noteId).remove();

    // remove note from notes array
    notes.splice(binary_search(notes,idx),1);
    localStorage.setItem("notes",JSON.stringify(notes));
}

// update note
let updateElement=null; // save index of element being updating
function updateNote(idx,title,des){
    //console.log("desc",des);
    updateElement=idx;
    addBox.click();
    titleTag.value=title;
    descTag.value=des.replaceAll('<br>','\n');
    popupBoxTitle.innerHTML="Update note";
    addBtn.innerHTML="Update note";
}

// submit button
addBtn.addEventListener("click",(event)=>{
    event.preventDefault();

    // remove the old note if note is updated
    if (updateElement!=null)
        deleteNote(updateElement);
    
    // add the new note 
    let noteTitle=titleTag.value; 
    let noteDesc=descTag.value;

    if (noteTitle || noteDesc)
    {
        let dateObj=new Date();
        let day=dateObj.getDate();
        let month=Months[dateObj.getMonth()-1];
        let year=dateObj.getFullYear();
        let noteInfo={
            title: noteTitle,
            desc: noteDesc,
            date: `${month} ${day}, ${year}`,
            id: ++index,
        }
        notes.push(noteInfo); // add new note
        addNote(noteInfo);
        localStorage.setItem("notes",JSON.stringify(notes)); // update notes to localStorage
        localStorage.setItem("index",JSON.stringify(index)); // update index to localStorage
        closeIcon.click();
    }
});