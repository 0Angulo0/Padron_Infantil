//& Card, CardHeader y CardContent son solo la estructura visual (MUI).
import { Card, CardContent,
    CardHeader } from "@mui/material";

import { useTranslate } from "react-admin";

export const Dashboard = () => {
  //? dashboard es un componente de mui y no viene de un resource como post/user,
  //? por eso hay que llamar translate() y pasarle las llaves que agregamos en i18nProvider.ts
  const translate = useTranslate();

  return (
    <Card>
      <CardHeader title={translate("dashboard.welcome.title")} />
      <CardContent>{translate("dashboard.welcome.subtitle")}</CardContent>
    </Card>
  );
};
