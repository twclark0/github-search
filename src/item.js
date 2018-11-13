import React from 'react'
import css from './item.module.css'

export default props => (
  <a className={css.headerContainer} href={props.url}>
    <div className={css.header}>
      <img className={css.avatar} src={props.avatar} alt="avatar" />
      <p className={css.login}>{props.login}</p>
    </div>
    <div className={css.info}>
      <p className={css.title}>{props.bio.name}</p>
      <p>{props.bio.bio || props.bio.website || props.bio.type}</p>
      <p>{props.bio.followers} followers</p>
      <p>Following {props.bio.following}</p>
    </div>
  </a>
)
