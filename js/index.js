const githubForm = document.getElementById('github-form')
const githubContainer = document.getElementById('github-container')
const userList = document.getElementById('user-list')
const reposList = document.getElementById('repos-list')
const inputName = document.getElementById('search')
const queryString = 'q=' + encodeURIComponent('GitHub Octocat in:readme user:defunkt');

githubForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let input = e.target.search.value
    let userInfo = await fetchUsers(e.target.search.value)
    // getUsers(input)
    githubForm.reset()
})

const fetchUsers = async (username) => {
    try {
        let res = await fetch(`https://api.github.com/search/users?q=${username}`)
        let req = await res.json()
        console.log(req)
        return req
    }
    catch {error} {
        console.log(error.message)
    }
}

const fetchRepos = async (username) => {
    try {
        let res = await fetch(`https://api.github.com/users/${username}/repos`)
        let req = await res.json()
        console.log(req)
        return req
    }
    catch {error} {
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

    div.addEventListener('click', async () => {
        reposList.innerHTML = ''
        getRepos(user.login)
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

const getRepos = async (username) => {
    let repos = await fetchRepos(username)
    repos.forEach((repo) => {
        renderRepos(repo)
    })
}

const getUsers = async (username) => {
    let users = await fetchUsers(username)
    users.items.forEach((user) => {
        renderUsers(user)
    })
}