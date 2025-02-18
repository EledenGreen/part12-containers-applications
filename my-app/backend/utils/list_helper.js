const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let i = 0
  let max = 0
  let max_i = 0

  if (blogs.length === 0) { return 0 }

  while (i < blogs.length) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
      max_i = i
    }
    i++
  }

  return blogs[max_i]
}

// -------Generic Approach-----------//
/* const mostBlogs = (blogs) => {
    let authorBlogsCount = {}

    for(let blog of blogs)
    {
        let author = blog.author

        if(authorBlogsCount[author])
        {
            authorBlogsCount[author]++
        }
        else{
            authorBlogsCount[author] = 1
        }
    }

    let maxAuthor = null, maxBlogs = 0

    for(let author in authorBlogsCount)
    {
        if(authorBlogsCount[author] > maxBlogs)
        {
            maxAuthor = author
            maxBlogs = authorBlogsCount[author]
        }
    }

    return {author: maxAuthor, blogs: maxBlogs}
} */

// ------Using lodash library------//
const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return null }

  const groupedBlogs = _.groupBy(blogs, 'author')

  const maxAuthor = _.maxBy(_.keys(groupedBlogs), (author) => groupedBlogs[author].length)

  return { author: maxAuthor, blogs: groupedBlogs[maxAuthor].length }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return null }

  const groupedBlogs = _.groupBy(blogs, 'author')

  const maxAuthorLikes = _.maxBy(_.keys(groupedBlogs), (author) => _.sumBy(groupedBlogs[author], 'likes'))

  return { author: maxAuthorLikes, likes: _.sumBy(groupedBlogs[maxAuthorLikes], 'likes') }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
