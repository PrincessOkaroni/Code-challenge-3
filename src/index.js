const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editPostForm = document.getElementById("edit-post-form");

const FALLBACK_IMAGE = "https://picsum.photos/400/200?random=1";

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    })
    .then((posts) => {
      postList.innerHTML = "";

      posts.forEach((post) => {
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0]);
      } else {
        postDetail.innerHTML = "<p>No posts available</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      postDetail.innerHTML = "<p>Error loading posts</p>";
    });
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post-item";
  postElement.tabIndex = 0;
  postElement.innerHTML = `
    <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.src='${FALLBACK_IMAGE}'" />
    <h3>${post.title}</h3>
    <p>By ${post.author}</p>
  `;
  postElement.addEventListener("click", () => handlePostClick(post));
  postElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handlePostClick(post);
    }
  });
  return postElement;
}

function handlePostClick(post) {
  postDetail.innerHTML = `
    <img src="${post.image}" alt="${post.title}" class="post-detail-image" onerror="this.src='${FALLBACK_IMAGE}'" />
    <h2>${post.title}</h2>
    <p><strong>Author:</strong> ${post.author}</p>
    <p><strong>Content:</strong> ${post.content}</p>
    <button id="edit-post">Edit</button>
    <button id="delete-post">Delete</button>
  `;

  document
    .getElementById("edit-post")
    .addEventListener("click", () => showEditForm(post));
  document
    .getElementById("delete-post")
    .addEventListener("click", () => deletePost(post));
}

function showEditForm(post) {
  editPostForm.classList.remove("hidden");

  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;
  if (document.getElementById("edit-author")) {
    document.getElementById("edit-author").value = post.author;
  }
  if (document.getElementById("edit-image")) {
    document.getElementById("edit-image").value = post.image;
  }

  editPostForm.onsubmit = (event) => {
    event.preventDefault();
    updatePost(post);
  };

  document.getElementById("cancel-edit").addEventListener("click", () => {
    editPostForm.classList.add("hidden");
  });
}

function updatePost(post) {
  const updatedTitle = document.getElementById("edit-title").value.trim();
  const updatedContent = document.getElementById("edit-content").value.trim();
  const updatedAuthor = document.getElementById("edit-author")
    ? document.getElementById("edit-author").value.trim()
    : post.author;
  const updatedImage = document.getElementById("edit-image")
    ? document.getElementById("edit-image").value.trim()
    : post.image;

  if (!updatedTitle || !updatedContent || !updatedAuthor) {
    alert("Title, author, and content cannot be empty");
    return;
  }

  fetch(`http://localhost:3000/posts/${post.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: updatedTitle,
      content: updatedContent,
      author: updatedAuthor,
      image: updatedImage,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    })
    .then((updatedPost) => {
      post.title = updatedPost.title;
      post.content = updatedPost.content;
      post.author = updatedPost.author;
      post.image = updatedPost.image;

      const postItems = postList.querySelectorAll(".post-item");
      postItems.forEach((item) => {
        if (
          item.querySelector("h3").textContent === updatedPost.title ||
          item.querySelector("h3").textContent === post.title
        ) {
          item.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.src='${FALLBACK_IMAGE}'" />
            <h3>${post.title}</h3>
            <p>By ${post.author}</p>
          `;
          item.addEventListener("click", () => handlePostClick(post));
          item.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              handlePostClick(post);
            }
          });
        }
      });

      handlePostClick(post);

      editPostForm.classList.add("hidden");
      editPostForm.onsubmit = null;
    })
    .catch((error) => {
      alert("Failed to update post. Please try again.");
      console.error("Error updating post:", error);
    });
}

function deletePost(post) {
  fetch(`http://localhost:3000/posts/${post.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete post");
      const postItems = postList.querySelectorAll(".post-item");
      postItems.forEach((item) => {
        if (item.querySelector("h3").textContent === post.title) {
          item.remove();
        }
      });

      const remainingPosts = postList.querySelectorAll(".post-item");
      if (remainingPosts.length > 0) {
        const firstPostElement = remainingPosts[0];
        const firstPostTitle = firstPostElement.querySelector("h3").textContent;
        fetch("http://localhost:3000/posts")
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch posts");
            return response.json();
          })
          .then((posts) => {
            const firstPost = posts.find((p) => p.title === firstPostTitle);
            if (firstPost) handlePostClick(firstPost);
          })
          .catch((error) => {
            console.error("Error fetching posts after deletion:", error);
            postDetail.innerHTML = "<p>Error loading posts</p>";
          });
      } else {
        postDetail.innerHTML = "<p>No posts available</p>";
      }
    })
    .catch((error) => {
      alert("Failed to delete post. Please try again.");
      console.error("Error deleting post:", error);
    });
}

function addNewPostListener() {
  newPostForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const content = document.getElementById("content").value.trim();
    const image =
      document.getElementById("image").value.trim() ||
      `https://picsum.photos/400/200?random=${Date.now()}`;

    if (!title || !author || !content) {
      alert("Please fill out title, author, and content fields");
      return;
    }

    const newPost = { title, author, content, image };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to create post");
        return response.json();
      })
      .then((post) => {
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
        newPostForm.reset();
        handlePostClick(post);
        if (editPostForm) {
          editPostForm.classList.add("hidden");
        }
      })
      .catch((error) => {
        alert("Failed to create post. Please try again.");
        console.error("Error creating post:", error);
      });
  });
}

document.addEventListener("DOMContentLoaded", main);
