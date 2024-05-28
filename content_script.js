urls = [""];

isJournal = true; //this has to be changed

if (!urls.includes(window.location.hostname) && isJournal == false) {
  document.body.innerHTML = `
    <div>
        <h1>Website is blocked</h1> 
        <p>Sorry, this website is blocked as you did not journal today</p>
        <button>Journal now</button>
    </div>`;
}
