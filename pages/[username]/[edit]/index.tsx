import * as React from "react";
import { getUserWithUsername } from "@lib/firebase";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { UserProfile } from "@lib/types";
import DefaultAvatar from "../../../assets/default-avatar.png";
import {
  Avatar,
  Cancel,
  CancelButton,
  UploadInput,
  UploadLabel,
  UserEditForm,
  UserEditTitle,
  UserEditVisibleTitle,
  UserEditWrapper,
  FileUpload,
  ButtonCancel,
  ButtonSave,
  ButtonWrapper,
  Profile,
  Textarea,
  AgeInput,
  Input,
  AgeFormGroup,
} from "./styles";
import { useLoadingStore } from "@lib/store";
import { FullPageSpinner } from "@components/Spinner";
import { FormGroup, Label } from "@styles/sharedStyles";

type Router = NextRouter & {
  query: { username: string };
};

type FormState = {
  fullname: string;
  age: string;
  work: string;
  location: string;
  bio: string;
};

const UsernameEdit: NextPage = () => {
  const { query, push } = useRouter() as Router;
  const { setStatus } = useLoadingStore();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [formState, setFormState] = React.useState<FormState>({
    fullname: "",
    age: "",
    work: "",
    location: "",
    bio: "",
  });

  const { fullname, age, work, location, bio } = formState;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    const setUserState = async () => {
      setStatus("loading");
      setUser((await getUserWithUsername(query.username)) as UserProfile);
      setStatus("success");
    };
    setUserState();
  }, [query.username, setStatus]);

  const uploadFile = () => {};

  if (!user) {
    return <FullPageSpinner />;
  }

  const avatarImage =
    user.avatarUrl === "" ? DefaultAvatar.src : user.avatarUrl;

  const isButtonDisabled =
    !fullname.length || !age.length || !work.length || !location.length;

  return (
    <UserEditForm onSubmit={handleSubmit}>
      <UserEditWrapper>
        <UserEditTitle>Editing Profile</UserEditTitle>
        <Avatar src={avatarImage} />
        <UploadInput
          aria-labelledby="upload"
          type="file"
          id="upload"
          onChange={uploadFile}
          accept="image/x-png,image/gif,image/jpeg"
        />
        <UploadLabel htmlFor="upload">
          Upload Image
          <FileUpload />
        </UploadLabel>
        <UserEditVisibleTitle aria-hidden="true">
          Editing Profile
        </UserEditVisibleTitle>
        <CancelButton
          aria-label="Cancel"
          onClick={() => push(`/${user.username}`)}
        >
          <Cancel />
        </CancelButton>
      </UserEditWrapper>
      <FormGroup>
        <Label htmlFor="fullname">Full Name *</Label>
        <Input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Naruto Uzumaki"
          value={fullname}
          onChange={(event) => handleChange(event)}
          aria-required="true"
        />
      </FormGroup>
      <AgeFormGroup>
        <Label htmlFor="Age">Age *</Label>
        <AgeInput
          id="age"
          name="age"
          type="number"
          placeholder="20"
          value={age}
          onChange={(event) => handleChange(event)}
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
          onChange={(event) => handleChange(event)}
          aria-required="true"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Los Angeles, California"
          value={location}
          onChange={(event) => handleChange(event)}
          aria-required="true"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="I’m a Ninja who enjoys cooking and creating new recipes in my spare time."
          value={bio}
          onChange={(event) => handleChange(event)}
        />
      </FormGroup>
      <ButtonWrapper>
        <ButtonSave type="submit" disabled={isButtonDisabled}>
          <Profile />
          Save
        </ButtonSave>
        <ButtonCancel onClick={() => push(`/${user.username}`)}>
          Cancel
        </ButtonCancel>
      </ButtonWrapper>
    </UserEditForm>
  );
};

export default UsernameEdit;
