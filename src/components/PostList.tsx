import React, { useState, useEffect } from 'react'
import { Post, User } from '../types'
import { postApi, userApi } from '../services/api'
import './PostList.css'

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsData, usersData] = await Promise.all([
        postApi.getPosts(),
        userApi.getUsers()
      ])
      setPosts(postsData)
      setUsers(usersData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getAuthorName = (authorId: number): string => {
    const user = users.find(u => u.id === authorId)
    return user ? user.name : '알 수 없음'
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (error) {
    return <div className="error">에러: {error}</div>
  }

  return (
    <div className="post-list-container">
      <h2>게시물 목록</h2>
      <div className="post-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>{post.title}</h3>
              <span className="post-meta">
                작성자: {getAuthorName(post.authorId)}
              </span>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              <span className="post-date">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="no-posts">
          <p>게시물이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default PostList
