import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps, matchPath } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Typography, Link } from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles(theme => ({}));

export type AppBreadcrumbsProps = RouteComponentProps;

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ location }) => {
  const classes = useStyles();
  const { _capitalizeFirstLetter } = useContext(AppContext);
  const [routePath, setRoutePath] = useState<{ label: string; to: string }[]>(
    []
  );

  useEffect(() => {
    const routePathTemp: { label: string; to: string }[] = [];
    location.pathname
      .split("/")
      .filter((path: string) => {
        return path !== "";
      })
      .forEach((e: string) => {
        routePathTemp.push({ label: _capitalizeFirstLetter(e), to: e });
      });
    setRoutePath(routePathTemp);
  }, [location]);

  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      style={{ padding: 8, marginTop: 8 }}
    >
      {location.pathname === "/" ? (
        <Typography color="textPrimary">Home</Typography>
      ) : (
        <Link component={RouterLink} to={`/`}>
          Home
        </Link>
      )}
      {routePath.length > 0 &&
        routePath.map((d: { label: string; to: string }, i: number) => {
          const last = i === routePath.length - 1;
          const to = `/${routePath
            .slice(0, i + 1)
            .map((p: { label: string; to: string }) => {
              return p.to;
            })
            .join("/")}`;
          const breadcrumbsLink = last ? (
            <Typography color="textPrimary" key={d.to}>
              {d.label}
            </Typography>
          ) : (
            <Link key={d.to} component={RouterLink} to={to}>
              {d.label}
            </Link>
          );
          return breadcrumbsLink;
        })}
    </Breadcrumbs>
  );
};
export default withRouter((props: any) => <AppBreadcrumbs {...props} />);
