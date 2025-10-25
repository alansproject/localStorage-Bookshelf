const booksDataInput = document.querySelectorAll(".left-section-input form input:not([type='checkbox'])")
const btnAddBook = document.querySelector("#bookFormSubmit")
const statusCheckBox = document.querySelector("input[type='checkbox']")
const incompleteBookContainer = document.querySelector('#incompleteBookList')
const completeBookContainer = document.querySelector('#completeBookList')
let finishedBooks = JSON.parse(localStorage.getItem('finishedBooks')) || []
let onProgressBooks = JSON.parse(localStorage.getItem('onProgressBooks')) || []

document.addEventListener("DOMContentLoaded", () => {
    if (!JSON.parse(localStorage.getItem('finishedBooks')) || !JSON.parse(localStorage.getItem('finishedBooks')).length){
        completeBookContainer.textContent = "Kosong..."
    } 
    else{
        render("finished")
    }

    if (!JSON.parse(localStorage.getItem('onProgressBooks')) || !JSON.parse(localStorage.getItem('onProgressBooks')).length){
        incompleteBookContainer.textContent = "Kosong..."
    }else{
        render("onProgress")
    }

    //button done logic
    document.querySelectorAll('.btn-done').forEach(btn => {
        const bookTargetId = btn.closest('.book-card').getAttribute("data-bookid")
        btn.addEventListener('click', ()=>{
            const targetBook = onProgressBooks.find(book => String(book.id) === bookTargetId)
            onProgressBooks = onProgressBooks.filter(book => String(book.id) != bookTargetId)
            targetBook.isComplete = true
            finishedBooks.push(targetBook)
            addToStorage()
            window.location.reload()
        })
    })

    //button move (from finished to onProgress)
    document.querySelectorAll('.btn-move').forEach(btn => {
        const bookTargetId = btn.closest(".book-card").getAttribute("data-bookid")
        btn.addEventListener("click", () => {
            const targetBook = finishedBooks.find(book => String(book.id) === bookTargetId)
            finishedBooks = finishedBooks.filter(book => String(book.id) != bookTargetId)
            targetBook.isComplete = false
            onProgressBooks.push(targetBook)
            addToStorage()
            window.location.reload() 
        })
    })

    //button delete for book deleting
    document.querySelectorAll('.btn-delete').forEach(btn => {
        const bookTargetId = btn.closest(".book-card").getAttribute("data-bookid")
        btn.addEventListener('click', () => {
            if (finishedBooks.find(book => String(book.id) === bookTargetId)){
                finishedBooks = finishedBooks.filter(book => String(book.id) != bookTargetId)
            }
            else{
                onProgressBooks = onProgressBooks.filter(book => String(book.id) != bookTargetId)
            }
            addToStorage()
            window.location.reload()
        })
    })

})

//Button search
document.querySelector('#searchSubmit').addEventListener('click', (e) => {
    e.preventDefault()
    const bookTitleInput = document.querySelector('#searchBookTitle')
    const popUpLayer = document.querySelector('.overlay')

    popUpLayer.style.display = "flex"
    bookTitleInput.blur()
        
    //search the similar book name
    const bookBeingSearched = [...finishedBooks, ...onProgressBooks].find(book => book.title.toLowerCase() == bookTitleInput.value.toLowerCase())

        if (bookBeingSearched){
            popUpLayer.innerHTML = `
                <div class="book-card" data-bookid="${bookBeingSearched.id}" data-testid="bookItem">
                    <h1 class='close' onClick="popUpClose()">X</h1>
                    <p style="font-size: 20px; margin-bottom: 2rem;">Search result</p>
                    <h3 data-testid="bookItemTitle">${bookBeingSearched.title}</h3>
                    <p data-testid="bookItemAuthor">Penulis: ${bookBeingSearched.author}</p>
                    <p data-testid="bookItemYear">Tahun: ${bookBeingSearched.year}</p>
                    <div>
                        <p> Status : <strong>${bookBeingSearched.isComplete ? "Selesai dibaca" : "Belum selesai"}</strong> </p>
                    </div>
                </div>
            `
        }else{
            popUpLayer.innerHTML = `<div class="book-card"><h1 class='close' onclick="popUpClose()">X</h1><p style="font-size: 20px; margin-bottom: 2rem;">Search result</p>not found</div>`
        }

        bookTitleInput.value = ""
})

function popUpClose(){
    const popUpLayer = document.querySelector('.overlay')

    popUpLayer.style.display = "none"
    window.location.reload()
}

statusCheckBox.addEventListener('change', () => {
    if (statusCheckBox.checked){
     btnAddBook.querySelector('span').textContent = "Selesai dibaca"
    }
    else{
        btnAddBook.querySelector('span').textContent = "Belum selesai dibaca"
    }
})

btnAddBook.addEventListener('click', (e) => {
    e.preventDefault()
    const bookData = {
        id: Date.now(),
        title: "",
        author: "",
        year: "",
        isComplete: statusCheckBox.checked
    }

    booksDataInput.forEach((input) => {
        bookData[input.name] = input.name == "year" ? Number(input.value) : input.value
    })

    if (bookData.title && bookData.author && bookData.year){
        if (statusCheckBox.checked){
            finishedBooks.push(bookData)
            addToStorage()
            completeBookContainer.innerHTML = ""
            render("finished")
        }else{
            onProgressBooks.push(bookData)
            addToStorage()
            incompleteBookContainer.innerHTML = ""
            render("onProgress")
        }
    }
    document.querySelector("form").reset()
    window.location.reload()
})


function addToStorage(){
    localStorage.setItem('finishedBooks', JSON.stringify(finishedBooks))
    localStorage.setItem('onProgressBooks', JSON.stringify(onProgressBooks))
}

function render(bookStatus){
    if (bookStatus === "onProgress"){
        JSON.parse(localStorage.getItem("onProgressBooks")).forEach(book => {
            incompleteBookContainer.innerHTML += `
                    <div data-bookid="${book.id}" data-testid="bookItem" class="book-card">
                      <h3 data-testid="bookItemTitle">${book.title}</h3>
                      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                      <div>
                        <button data-testid="bookItemIsCompleteButton" class="btn-done">Selesai dibaca</button>
                        <button data-testid="bookItemDeleteButton" class="btn-delete">Hapus Buku</button>
                        <button data-testid="bookItemEditButton" class="btn-edit">Edit Buku</button>
                      </div>
                    </div>
            `
        })
        return
    }

    if (bookStatus === "finished"){
        JSON.parse(localStorage.getItem("finishedBooks")).forEach(book => {
            completeBookContainer.innerHTML += `
            <div data-bookid="${book.id}" data-testid="bookItem" class="book-card">
                      <h3 data-testid="bookItemTitle">${book.title}</h3>
                      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                      <div>
                        <button data-testid="bookItemIsCompleteButton" class="btn-move">Pindah ke Belum Selesai</button>
                        <button data-testid="bookItemDeleteButton" class="btn-delete">Hapus Buku</button>
                        <button data-testid="bookItemEditButton" class="btn-edit">Edit Buku</button>
                      </div>
                    </div>
            `
        })
    }
}

