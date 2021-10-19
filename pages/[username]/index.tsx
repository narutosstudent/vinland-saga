import Link from 'next/link'
import { firebaseDb, getUserWithUsername, recipeToJSON } from '@lib/firebase'
import defaultAvatar from '../../assets/default-avatar.png'
import { Recipe, UserProfile } from '@lib/types'
import type { NextPage } from 'next'
import { useUserContext } from '@lib/context'
import {
  Avatar,
  EditLink,
  Pen,
  ProfileTitle,
  ProfileUsername,
  RecipesSection,
  ProfileText,
  ProfileSection,
  HiddenProfileTitle,
  RecipesHeading,
  NoRecipesText,
  NewRecipeButton,
  UsernameWrapper,
  Dot,
  Line,
} from './styles'
import {
  Timestamp,
  query as fbQuery,
  collection,
  where,
  getDocs,
} from '@firebase/firestore'
import { FullPageSpinner } from '@components/Spinner'
import { useNewRecipeStore } from '@lib/store'
import { RecipeItem } from '@components/RecipeItem'

type ServerProps = {
  query: {
    username: string
  }
}

export async function getServerSideProps({ query }: ServerProps) {
  const { username } = query

  const user = await getUserWithUsername(username)

  let recipes = [] as Recipe[]

  const recipeDocs = fbQuery(
    collection(firebaseDb, `users/${user?.uid}/recipes`),
    where('username', '==', username)
  )

  const recipesSnapshot = await getDocs(recipeDocs)

  if (!recipesSnapshot.empty) {
    recipes = recipesSnapshot.docs.map((recipeDoc) => recipeToJSON(recipeDoc))
  }

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: { user, recipes },
  }
}

type Props = {
  user: UserProfile
  recipes: Recipe[]
}

const Profile: NextPage<Props> = ({ user, recipes }) => {
  const { username } = useUserContext()

  const { setIsModalOpen } = useNewRecipeStore()

  const joined = (
    typeof user.joined === 'number'
      ? new Date(user.joined)
      : (user.joined as Timestamp).toDate()
  )
    .toISOString()
    .split('T')[0]

  if (!user) {
    return <FullPageSpinner />
  }

  return (
    <>
      <UsernameWrapper>
        <ProfileSection>
          <HiddenProfileTitle>{user.fullname}</HiddenProfileTitle>
          <Avatar
            src={user.avatarUrl === '' ? defaultAvatar.src : user.avatarUrl}
            alt={user.fullname}
          />
          <ProfileUsername>@{user.username}</ProfileUsername>
          <ProfileTitle
            aria-hidden="true"
            isNotAuthorizedUser={user.username !== username}
          >
            {user.fullname}
          </ProfileTitle>
          {user.username === username && (
            <Link passHref href={`/${username}/edit`}>
              <EditLink aria-label="Edit Your Profile">
                <Pen />
              </EditLink>
            </Link>
          )}
          <ProfileText>
            <span>Age {user.age}</span>
            <Dot />
            <span>Located in {user.location}</span> <Dot />
            <span>{user.bio}</span>
            <Dot />
            <span>{user.work}</span>
            <Dot />
            <span>Since {joined}</span>
          </ProfileText>
          <Line />
        </ProfileSection>
        <RecipesSection>
          <RecipesHeading>Recipes</RecipesHeading>
          {recipes.length ? (
            recipes.map((recipe) => (
              <RecipeItem key={recipe.slug} recipe={recipe} />
            ))
          ) : (
            <>
              <NoRecipesText>
                You currently have written no recipes.
              </NoRecipesText>
              <NewRecipeButton onClick={() => setIsModalOpen(true)}>
                New Recipe
              </NewRecipeButton>
            </>
          )}
        </RecipesSection>
      </UsernameWrapper>
    </>
  )
}

export default Profile
