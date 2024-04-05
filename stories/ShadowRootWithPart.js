import React from "react"

export const ShadowRoot = ({ label = "Hello from shadow DOM" }) => {
  const ref = React.useRef()

  React.useEffect(() => {
    if (!ref.current.attachShadow) return
    ref.current.attachShadow({ mode: "closed" })
    ref.current.shadowRoot.innerHTML = `
      <button part="foo">${label}</button>
    `
    ref.current.innerHTML = `
      <style>
        ::part(foo) {
          font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 700;
          border: 0;
          border-radius: 3em;
          cursor: pointer;
          display: inline-block;
          line-height: 1;
          color: white;
          background-color: tomato;
          font-size: 14px;
          padding: 11px 20px;
        }
        ::part(foo):hover {
          text-decoration: underline;
        }
        ::part(foo):focus {
          box-shadow: inset 0 0 0 2px maroon;
          outline: 0;
        }
        ::part(foo):active {
          background-color: firebrick;
        }
      </style>
    `
  }, [])

  return <div ref={ref} />
}
