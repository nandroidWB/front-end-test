import React from "react"
import { useUiTheme } from "../../../client/hooks/theme"
import { Id } from "../../../model/Misc"
import { useNavigation } from "../../navigation"
import { Txt } from "../primitives/Text"
import { useTranslationDict } from "../../i18n/internationalization"

export const UserDetailButton = (
  props: {
    userId: Id,
    text?: string
  }
) => {

  const theme = useUiTheme()
  const dict = useTranslationDict()

  const navigation = useNavigation()

  return <Txt
    onClick={navigation.goTo.detail.profile(props.userId)}
    type="subtitle2"
    color={theme.palette.primary}
    text={props.text ?? dict.actions.viewProfile}
  />
}
