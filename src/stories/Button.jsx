import React from "react"
import "./button.css"

export const Button = (props) => (
  <button {...props} className={["button", props.className].filter(Boolean).join(" ")} />
)
