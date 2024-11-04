import PropTypes from "prop-types";
import { Avatar, Typography } from "@material-tailwind/react";

export function MessageCard({ img = "/img/bruce-mars.jpeg", username, role, action }) {
  // const image = "/img/bruce-mars.jpeg";
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          src={img}
          alt={username}
          variant="rounded"
          className="shadow-sm shadow-blue-gray-500/25"
        />
        <div>
          <Typography
            variant="small"
            color="white"
            className="mb-1 font-semibold"
          >
            {username}
          </Typography>
          <Typography className="text-xs font-normal text-white">
            {role}
          </Typography>
        </div>
      </div>
      {action}
    </div>
  );
}

MessageCard.defaultProps = {
  action: null,
};

MessageCard.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.node.isRequired,
  action: PropTypes.node,
};

MessageCard.displayName = "/src/widgets/cards/message-card.jsx";

export default MessageCard;
