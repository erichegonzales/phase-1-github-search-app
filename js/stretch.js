const githubForm = document.getElementById('github-form')
const githubContainer = document.getElementById('github-container')
const userList = document.getElementById('user-list')
const reposList = document.getElementById('repos-list')
const inputName = document.getElementById('search')
const dropdown = document.getElementById('dropdown')
let searchType
let url
let queryString = ''

dropdown.addEventListener('change', () => {
    searchType = dropdown.value
})


// when a user presses submit
// save the current search type (username or repo)
// edit the addevent listener so that it fetches the right api
// in the fetch function
// fetch the url depending on the keyword the user inputs
// change the url 

githubForm.addEventListener('submit', async (e) => {
    userList.innerHTML = ''
    reposList.innerHTML = ''
    e.preventDefault()
    let queryString = e.target.search.value
    if (searchType === 'User') url = `https://api.github.com/search/users?q=` + encodeURI(`${queryString}`)
    if (searchType === 'Repository') url = `https://api.github.com/search/repositories?q=` + encodeURI(`${queryString}`)
    
    console.log(url)
    let data = await fetchData(url)
    getData(data, searchType)
    e.target.search.value = ''
})

const fetchData = async (url) => {
    try {
        let res = await fetch(url)
        let req = await res.json()
        console.log(req)
        return req
    }
    catch { error } {
        console.log(error.message)
    }
}

const renderUsers = (user) => {
    let li = document.createElement('li')
    let div = document.createElement('div')
    let h2 = document.createElement('h2')
    let h3 = document.createElement('h3')
    let img = document.createElement('img')

    li.setAttribute('class', 'li')
    h2.innerText = `GitHub username: ${user.login}`
    h3.innerText = `Link to profile: ${user['html_url']}`
    img.src = user['avatar_url']

    userList.append(li)
    li.append(div)
    div.append(h2, h3, img)

    li.addEventListener('click', async () => {
        reposList.innerHTML = ''
        queryString = user.login
        url = `https://api.github.com/users/${queryString}/repos`
        let repos = await fetchData(url)
        repos.forEach((item) => renderRepos(item))
    })
}

const renderRepos = (repo) => {
    let li = document.createElement('li')
    let div = document.createElement('div')
    li.setAttribute('class', 'li')
    li.innerText = repo.name
    div.append(li)
    reposList.append(div)
}

const getData = (data, searchType, queryString) => {
    if (searchType === 'User') data.items.forEach((item) => renderUsers(item))
    if (searchType === 'Repository') data.items.forEach((item) => renderRepos(item))
}