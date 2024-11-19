// Mock data for web version
export const mockBookmarks = [
  {
    title: "Bookmarks Bar",
    children: [
      {
        title: "Development",
        children: [
          {
            title: "Frontend",
            children: [
              {
                title: "JavaScript",
                children: [
                  {
                    title: "MDN Web Docs",
                    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                  },
                  {
                    title: "JavaScript.info",
                    url: "https://javascript.info"
                  },
                  {
                    title: "Frameworks",
                    children: [
                      {
                        title: "React",
                        children: [
                          {
                            title: "React Documentation",
                            url: "https://reactjs.org"
                          },
                          {
                            title: "React Router",
                            url: "https://reactrouter.com"
                          },
                          {
                            title: "Redux",
                            url: "https://redux.js.org"
                          }
                        ]
                      },
                      {
                        title: "Vue",
                        children: [
                          {
                            title: "Vue.js Guide",
                            url: "https://vuejs.org"
                          },
                          {
                            title: "Vuex",
                            url: "https://vuex.vuejs.org"
                          }
                        ]
                      },
                      {
                        title: "Angular",
                        children: [
                          {
                            title: "Angular.io",
                            url: "https://angular.io"
                          },
                          {
                            title: "NgRx",
                            url: "https://ngrx.io"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                title: "CSS",
                children: [
                  {
                    title: "CSS Tricks",
                    url: "https://css-tricks.com"
                  },
                  {
                    title: "Frameworks",
                    children: [
                      {
                        title: "Tailwind CSS",
                        url: "https://tailwindcss.com"
                      },
                      {
                        title: "Bootstrap",
                        url: "https://getbootstrap.com"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "Backend",
            children: [
              {
                title: "Node.js",
                children: [
                  {
                    title: "Node.js Docs",
                    url: "https://nodejs.org/docs"
                  },
                  {
                    title: "Express.js",
                    url: "https://expressjs.com"
                  }
                ]
              },
              {
                title: "Python",
                children: [
                  {
                    title: "Python Docs",
                    url: "https://docs.python.org"
                  },
                  {
                    title: "Django",
                    url: "https://djangoproject.com"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Design",
        children: [
          {
            title: "Resources",
            children: [
              {
                title: "Dribbble",
                url: "https://dribbble.com"
              },
              {
                title: "Behance",
                url: "https://behance.net"
              }
            ]
          },
          {
            title: "Tools",
            children: [
              {
                title: "Figma",
                url: "https://figma.com"
              },
              {
                title: "Adobe XD",
                url: "https://adobe.com/products/xd.html"
              }
            ]
          }
        ]
      },
      {
        title: "Productivity",
        children: [
          {
            title: "Task Management",
            children: [
              {
                title: "Trello",
                url: "https://trello.com"
              },
              {
                title: "Asana",
                url: "https://asana.com"
              },
              {
                title: "Notion",
                url: "https://notion.so"
              }
            ]
          },
          {
            title: "Communication",
            children: [
              {
                title: "Slack",
                url: "https://slack.com"
              },
              {
                title: "Discord",
                url: "https://discord.com"
              }
            ]
          }
        ]
      },
      {
        title: "Learning",
        children: [
          {
            title: "Platforms",
            children: [
              {
                title: "Coursera",
                url: "https://coursera.org"
              },
              {
                title: "Udemy",
                url: "https://udemy.com"
              },
              {
                title: "freeCodeCamp",
                url: "https://freecodecamp.org"
              }
            ]
          },
          {
            title: "Documentation",
            children: [
              {
                title: "DevDocs",
                url: "https://devdocs.io"
              },
              {
                title: "W3Schools",
                url: "https://w3schools.com"
              }
            ]
          }
        ]
      }
    ]
  }
];

// Detect environment and provide appropriate bookmarks API
export const bookmarksAPI = {
  isExtension: typeof chrome !== 'undefined' && chrome.bookmarks,
  
  async getBookmarks() {
    if (this.isExtension) {
      return new Promise((resolve) => {
        try {
          chrome.bookmarks.getTree((bookmarks) => {
            if (chrome.runtime.lastError) {
              console.error('Error fetching Chrome bookmarks:', chrome.runtime.lastError);
              resolve([]);
            } else {
              resolve(bookmarks);
            }
          });
        } catch (error) {
          console.error('Error accessing Chrome bookmarks API:', error);
          resolve([]);
        }
      });
    } else {
      try {
        // Add random dates within the last year for mock data
        const addRandomDates = (items) => {
          for (const item of items) {
            if (item.url) {
              const randomDays = Math.floor(Math.random() * 365);
              const date = new Date();
              date.setDate(date.getDate() - randomDays);
              item.dateAdded = date.getTime();
            }
            if (item.children) {
              addRandomDates(item.children);
            }
          }
        };
        
        const bookmarks = JSON.parse(JSON.stringify(mockBookmarks));
        addRandomDates(bookmarks);
        return bookmarks;
      } catch (error) {
        console.error('Error processing mock bookmarks:', error);
        return [];
      }
    }
  }
};