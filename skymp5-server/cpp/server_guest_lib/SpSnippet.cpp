#include "SpSnippet.h"

#include "MpActor.h"
#include "NetworkingInterface.h" // Format

SpSnippet::SpSnippet(const char* cl_, const char* func_, const char* args_,
                     uint32_t selfId_)
  : cl(cl_)
  , func(func_)
  , args(args_)
  , selfId(selfId_)
{
}

Viet::Promise<VarValue> SpSnippet::Execute(MpActor* actor)
{
  Viet::Promise<VarValue> promise;

  auto snippetIdx = actor->NextSnippetIndex(promise);

  // Player character is always 0x14 on client, but 0xff000000+ in our server
  // See also SpSnippetFunctionGen.cpp
  auto targetSelfId = selfId < 0xff000000 ? selfId : 0x14;

  Networking::Format(
    [&](Networking::PacketData data, size_t len) {
      actor->SendToUser(data, len, true);
    },
    R"({"type": "spSnippet", "class": "%s", "function": "%s", "arguments": %s, "selfId": %u, "snippetIdx": %u})",
    cl, func, args, targetSelfId, snippetIdx);

  return promise;
}
