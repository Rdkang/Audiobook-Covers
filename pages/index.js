const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const resultsContainer = document.getElementById("results-container")

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault()
    search()
  }
})

searchBtn.addEventListener("click", search)

async function search() {
  const query = searchInput.value
  try {
    const response = await fetch(`https://api.audiobookcovers.com/cover/bytext/?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error(response.status)
    }
    const results = await response.json()
    displayResults(results)
  } catch (error) {
    displayError(error)
  }

  searchInput.blur() // Remove the focus from the input element
}

function displayResults(results) {
  resultsContainer.innerHTML = ""

  if (results.length === 0) {
    const noResultsMessage = document.createElement("p")
    noResultsMessage.textContent = "No results found."
    resultsContainer.appendChild(noResultsMessage)
    return
  }

  results.forEach((result) => {
    const coverContainer = document.createElement("div")
    coverContainer.className = "cover-container"

    const coverImage = document.createElement("img")
    coverImage.src = result.filename
    coverImage.className = "cover-image"

    coverImage.onclick = function () {
      window.open(result.filename, "_blank")
    }

    const sourceLink = document.createElement("a")
    sourceLink.href = result.source
    sourceLink.className = "source-link"
    sourceLink.target = "_blank"

    const redditLogo = document.createElement("img")
    redditLogo.src = "reddit-logo.png"
    redditLogo.alt = "Reddit Source"
    redditLogo.className = "reddit-logo"
    sourceLink.appendChild(redditLogo)

    coverContainer.appendChild(coverImage)
    coverContainer.appendChild(sourceLink)
    resultsContainer.appendChild(coverContainer)
  })
}

function displayError(error) {
  resultsContainer.innerHTML = ""
  const errorMessage = document.createElement("p")
  errorMessage.textContent = `An error occurred: ${error.message}`
  resultsContainer.appendChild(errorMessage)
}
