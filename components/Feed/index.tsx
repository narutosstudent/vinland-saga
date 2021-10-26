import * as React from 'react'
import {
  NoFoundText,
  FeedContainer,
  TopWrapper,
  Title,
  RadioContainer,
  RadioLabel,
  Input,
} from './styles'

type Props = {
  children: React.ReactNode
  labels: [string, string]
  title: string
  itemsLength: number
}

export const Feed = ({ children, labels, title, itemsLength }: Props) => {
  const [firstLabel, secondLabel] = labels

  const [selectedSortOption, setSelectedSortOption] = React.useState(firstLabel)

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSortOption(event.target.value)
  }

  return (
    <FeedContainer>
      <TopWrapper>
        <Title>{title}</Title>
        <RadioContainer>
          <Input
            type="radio"
            id={firstLabel}
            value={firstLabel}
            checked={selectedSortOption === firstLabel}
            onChange={handleSortChange}
          />
          <RadioLabel htmlFor={firstLabel} aria-label={`Sort by ${firstLabel}`}>
            {firstLabel}
          </RadioLabel>

          <Input
            type="radio"
            id={secondLabel}
            value={secondLabel}
            checked={selectedSortOption === secondLabel}
            onChange={handleSortChange}
          />
          <RadioLabel
            htmlFor={secondLabel}
            aria-label={`Sort by ${secondLabel}`}
          >
            {secondLabel}
          </RadioLabel>
        </RadioContainer>
      </TopWrapper>
      {itemsLength ? (
        children
      ) : (
        <NoFoundText>Currently no {title.toLowerCase()} exist.</NoFoundText>
      )}
    </FeedContainer>
  )
}