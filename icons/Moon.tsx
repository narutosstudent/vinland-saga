import { v4 as uuidv4 } from 'uuid'

export const MoonIcon = () => {
  const uniqueString = uuidv4()

  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g clipPath={`url(#${uniqueString})`}>
        <path
          d="M12 10.999A4.51 4.51 0 0 1 14.999 14 4.52 4.52 0 0 1 18 11a4.521 4.521 0 0 1-3.001-3A4.509 4.509 0 0 1 12 10.999Zm8.001.001a3.011 3.011 0 0 1 2 2.001A3.006 3.006 0 0 1 24 11a3.012 3.012 0 0 1-2-2 3.01 3.01 0 0 1-1.999 2Zm-1-9a4.514 4.514 0 0 1-2.998 3.001 4.52 4.52 0 0 1 3.001 3.002A4.515 4.515 0 0 1 22 5.001 4.522 4.522 0 0 1 19.001 2ZM12 24C5.383 24 0 18.617 0 12S5.383 0 12 0c1.894 0 3.63.497 5.37 1.179C14.422 1.683 8 4.445 8 12c0 7.454 5.917 10.208 9.37 10.821C15.87 23.667 13.894 24 12 24Z"
          fill="#412D09"
        />
      </g>
      <defs>
        <clipPath id={uniqueString}>
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
