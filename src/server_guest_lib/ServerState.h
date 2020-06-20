#pragma once
#include <Networking.h>
#include <array>
#include <memory>
#include <optional>
#include <simdjson.h>
#include <unordered_map>

struct UserInfo
{
};

class ServerState
{
public:
  enum class MessageMethod
  {
    OnReceive,
    OnCacheReady
  };

  ServerState() { userInfo.resize(65536); }

  std::vector<std::optional<UserInfo>> userInfo;
  Networking::UserId maxConnectedId = 0;

  void Connect(Networking::UserId userId);
  void Disconnect(Networking::UserId userId);
  bool IsConnected(Networking::UserId userId) const;
};