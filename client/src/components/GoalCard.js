import * as React from "react";
import { navigate } from "@reach/router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const bull = (
  <Box
    component='span'
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const GoalCard = (props) => {
  const { goal, userId, deleteGoalHandler } = props;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          GOAL:
        </Typography>
        <Typography variant='h5' component='div'>
          {goal.goalText}
        </Typography>
        <Typography
          variant='h5'
          component='div'
          color='textPrimary'
        ></Typography>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Target Finish Date:{" "}
          {new Date(goal.targetFinishDate).toLocaleDateString("en-us")}{" "}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {`Likes: ${goal.likes.length}`}
        </Typography>
        {/* <Typography variant='body2'>
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
        {/* <Button size='small'>Learn More</Button>
        <Button size='small'>Learn More</Button>
        <Button size='small'>Learn More</Button>
        <Button size='small'>Learn More</Button> */}
        <Button
          size='small'
          variant='outlined'
          color='primary'
          onClick={() => navigate(`/goals/${goal._id}`)}
        >
          View Goal Details
        </Button>
        {goal.user_id ? (
          <Button
            size='small'
            variant='outlined'
            onClick={() => navigate(`/user/goals/${goal.user_id._id}`)}
          >
            Added By: {goal.user_id.firstName}
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default GoalCard;
