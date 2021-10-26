import ClapSVG from '../../assets/clap.svg'
import ClapFilledSVG from '../../assets/clap-filled.svg'
import { Button } from './styles'

type Props = {
  clapCount: number
  hasUserClap: boolean
  handleClap: () => void
  label: string
  isDark?: boolean
  className?: string
}

export const ClapButton = ({
  label,
  clapCount,
  handleClap,
  hasUserClap,
  isDark,
  className,
}: Props) => {
  return (
    <Button
      aria-label={`${label} ${clapCount} claps`}
      aria-pressed={hasUserClap}
      onClick={() => handleClap()}
      isDark={isDark}
      className={className}
    >
      {hasUserClap ? <ClapFilledSVG /> : <ClapSVG />}
      {clapCount}
    </Button>
  )
}
