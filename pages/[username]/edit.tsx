import * as React from 'react'
import Link from 'next/link'
import { auth, firebaseDb } from '@lib/firebase/firebase'
import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import FileUploadSVG from '../../assets/file-upload.svg'
import ProfileSVG from '../../assets/profile.svg'
import {
  Avatar,
  CancelLink,
  UploadInput,
  UploadLabel,
  EditForm,
  HiddenEditTitle,
  VisibleTitle,
  EditWrapper,
  LinkCancel,
  ButtonSave,
  ButtonWrapper,
  Textarea,
  AgeInput,
  Input,
  AgeFormGroup,
  UploadProgress,
} from '../../styles/editStyles'
import { useLoadingStore } from '@lib/store'
import { FullPageSpinner } from '@components/Spinner'
import { FormGroup, Label } from '@styles/formStyles'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@firebase/storage'
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from '@firebase/firestore'
import toast from 'react-hot-toast'
import { useGetChef } from '@hooks/auth/useGetChef'
import { useUserContext } from '@lib/context'
import { useFormState } from '@hooks/useFormState'
import { Metatags } from '@components/Metatags'
import { CloseIcon } from '@icons/Close'
import { defaultAvatar } from '@styles/theme'

type Router = NextRouter & {
  query: { username: string }
}

const ProfileEdit: NextPage = () => {
  const {
    query: { username: queryUsername },
    push,
  } = useRouter() as Router
  const { setStatus } = useLoadingStore()
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [avatarImage, setAvatarImage] = React.useState('')

  const { chef } = useGetChef(queryUsername)
  const { username } = useUserContext()

  const {
    handleChange,
    formState: { fullname, age, work, location, bio },
    setFormState,
  } = useFormState({
    fullname: '',
    age: '',
    work: '',
    location: '',
    bio: '',
  })

  React.useEffect(() => {
    if (queryUsername !== username) {
      toast.error('You are not authorized to edit this profile.')
      push('/')
      return
    }

    if (chef) {
      setFormState({
        fullname: chef.fullname,
        age: chef.age,
        work: chef.work,
        location: chef.location,
        bio: chef.bio,
      })
    }
  }, [username, push, setFormState, chef, queryUsername])

  const userRef = doc(firebaseDb, `chefs/${auth.currentUser?.uid}`)

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(event.target.files as FileList)[0]
    const extension = file.type.split('/')[1]

    const storage = getStorage()
    const avatarRef = ref(
      storage,
      `avatars/${auth.currentUser!.uid}.${extension}`
    )

    setStatus('loading')

    const uploadTask = uploadBytesResumable(avatarRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setUploadProgress(progress)
      },
      () => {
        toast.error('Avatar upload did not succeed.')
        setUploadProgress(0)
        setStatus('error')
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDoc(userRef, { avatarUrl: downloadURL }, { merge: true })
          setAvatarImage(downloadURL)
          toast.success('Successfully uploaded your avatar.')
          setStatus('success')
        })
      }
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')

    const batch = writeBatch(firebaseDb)

    const updatedUserProperties = {
      authorAvatarUrl: avatarImage === '' ? chef!.avatarUrl : avatarImage,
      authorFullname: fullname,
    }

    const recipeDocs = query(
      collection(firebaseDb, `chefs/${auth.currentUser!.uid}/recipes`)
    )
    const recipesSnapshot = await getDocs(recipeDocs)
    if (recipesSnapshot.docs.length > 0) {
      recipesSnapshot.forEach((recipeDoc) => {
        batch.update(recipeDoc.ref, updatedUserProperties)
      })
    }

    const commentDocs = query(
      collectionGroup(firebaseDb, 'comments'),
      where('uid', '==', auth.currentUser?.uid)
    )
    const commentsSnapshot = await getDocs(commentDocs)
    if (commentsSnapshot.docs.length > 0) {
      commentsSnapshot.forEach((commentDoc) => {
        batch.update(commentDoc.ref, updatedUserProperties)
      })
    }

    batch.update(userRef, {
      bio,
      work,
      location,
      fullname,
      age,
    })

    await batch.commit()

    toast.success('Successfully updated your profile.')

    push(`/${queryUsername}`)
    setStatus('success')
  }

  if (!chef || queryUsername !== username) {
    return <FullPageSpinner />
  }

  const image =
    avatarImage !== ''
      ? avatarImage
      : chef.avatarUrl !== ''
      ? chef.avatarUrl
      : defaultAvatar

  const isButtonDisabled =
    !fullname.length ||
    !age.length ||
    !work.length ||
    !location.length ||
    !bio.length

  return (
    <>
      <Metatags title="Profile Edit" description={`Edit your profile.`} />
      <EditForm onSubmit={handleSubmit}>
        <EditWrapper>
          <HiddenEditTitle>Editing Profile</HiddenEditTitle>
          <Avatar
            src={image}
            alt={image === defaultAvatar ? 'default' : 'avatar'}
          />
          {uploadProgress !== 0 && (
            <UploadProgress
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuetext="Uploading image"
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {uploadProgress}%
            </UploadProgress>
          )}
          <UploadInput
            type="file"
            id="upload"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
          />
          <UploadLabel htmlFor="upload">
            Avatar Upload
            <FileUploadSVG />
          </UploadLabel>
          <VisibleTitle aria-hidden="true">Editing Profile</VisibleTitle>

          <Link passHref href={`/${chef.username}`}>
            <CancelLink aria-label="Cancel">
              <CloseIcon />
            </CancelLink>
          </Link>
        </EditWrapper>
        <FormGroup>
          <Label htmlFor="fullname">Full Name *</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Naruto Uzumaki"
            value={fullname}
            onChange={handleChange}
            aria-required="true"
          />
        </FormGroup>
        <AgeFormGroup>
          <Label htmlFor="age">Age *</Label>
          <AgeInput
            id="age"
            name="age"
            type="number"
            placeholder="20"
            value={age}
            onChange={handleChange}
            aria-required="true"
          />
        </AgeFormGroup>
        <FormGroup>
          <Label htmlFor="work">Work *</Label>
          <Input
            id="work"
            name="work"
            type="text"
            placeholder="Chef at Starship"
            value={work}
            onChange={handleChange}
            aria-required="true"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="San Diego, California"
            value={location}
            onChange={handleChange}
            aria-required="true"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="bio">Biography *</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="I’m a Ninja who enjoys cooking and creating new recipes in my spare time."
            value={bio}
            onChange={handleChange}
          />
        </FormGroup>
        <ButtonWrapper>
          <ButtonSave type="submit" disabled={isButtonDisabled}>
            <ProfileSVG />
            Save
          </ButtonSave>
          <Link passHref href={`/${chef.username}`}>
            <LinkCancel>Cancel</LinkCancel>
          </Link>
        </ButtonWrapper>
      </EditForm>
    </>
  )
}

export default ProfileEdit
